import redis
import json
import time
import logging
import signal
import sys
from utils.video_generator import generate_video
from pymongo import MongoClient
from bson import ObjectId
from contextlib import contextmanager
import os
from dotenv import load_dotenv # type: ignore



# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
load_dotenv()


mongo_uri = os.getenv("MONGO_URI")
mongo_database = os.getenv("DATABASE")
mongo_collection = os.getenv("COLLECTION")
redis_port = os.getenv("REDIS_PORT")
redis_host = os.getenv("REDIS_HOST")
class VideoWorker:
    def __init__(self):
        self.redis_client = redis.Redis(
            host=redis_host, 
            port=redis_port, 
            db=0,
            decode_responses=False,
            socket_connect_timeout=5,
            socket_timeout=5
        )
        self.mongo = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        self.db = self.mongo[mongo_database]
        self.jobs_collection = self.db[mongo_collection]
        self.running = True
        self.setup_signal_handlers()
        
    def setup_signal_handlers(self):
        """Graceful shutdown on SIGINT/SIGTERM"""
        signal.signal(signal.SIGINT, self.shutdown)
        signal.signal(signal.SIGTERM, self.shutdown)
        
    def shutdown(self, signum, frame):
        logger.info("Shutting down worker gracefully...")
        self.running = False
        sys.exit(0)
        
    @contextmanager
    def job_processing(self, job_id):
        """Context manager for job processing"""
        try:
            self.update_job(job_id, {"status": "processing", "startedAt": time.time()})
            yield
        except Exception as e:
            logger.error(f"Job {job_id} failed: {str(e)}")
            self.update_job(job_id, {
                "status": "failed", 
                "error": str(e),
                "failedAt": time.time()
            })
            raise
            
    def update_job(self, job_id, updates):
        """Update job in MongoDB"""
        try:
            self.jobs_collection.update_one(
                {"_id": ObjectId(job_id)},
                {"$set": updates}
            )
        except Exception as e:
            logger.error(f"Failed to update job {job_id}: {e}")
            
    def process_job(self, job_data):
        """Process a single job with error handling"""
        job = json.loads(job_data)
        job_id = job['jobId']
        prompt = job['prompt']
        
        logger.info(f"Processing job: {job_id}, prompt: {prompt[:50]}...")
        
        with self.job_processing(job_id):
            # Add progress updates
            self.update_job(job_id, {"progress": 10})
            
            video_url = generate_video(
                job_id, 
                prompt,
                progress_callback=lambda p: self.update_job(job_id, {"progress": p})
            )
            
            self.update_job(job_id, {
                "status": "completed",
                "videoURL": video_url,
                "completedAt": time.time(),
                "progress": 100
            })
            
            logger.info(f"Job {job_id} completed successfully")
            
    def run(self):
        """Main worker loop"""
        logger.info("Video worker started...")
        
        while self.running:
            try:
                # Block for 1 second, then check if still running
                result = self.redis_client.brpop("video_jobs", timeout=1)
                
                if result:
                    _, job_data = result
                    self.process_job(job_data)
                    
            except redis.ConnectionError:
                logger.error("Redis connection lost. Retrying in 5 seconds...")
                time.sleep(5)
            except Exception as e:
                logger.error(f"Unexpected error: {e}")
                time.sleep(1)

if __name__ == "__main__":
    worker = VideoWorker()
    worker.run()