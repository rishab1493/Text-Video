import os
import torch
import numpy as np
from diffusers import AutoPipelineForText2Image
from moviepy.video.io.ImageSequenceClip import ImageSequenceClip
from typing import Callable, Optional
import hashlib

class VideoGenerator:
    def __init__(self):
        self.device = "mps" if torch.backends.mps.is_available() else "cpu"
        self.pipe = None
        self.model_loaded = False
        
    def load_model(self):
        """Lazy load model only when needed"""
        if not self.model_loaded:
            print(f"Loading model on {self.device}...")
            dtype = torch.float32  # safer on MPS
            self.pipe = AutoPipelineForText2Image.from_pretrained(
                    "stabilityai/sd-turbo",
                 torch_dtype=dtype,
               safety_checker=None,
                         requires_safety_checker=False
                   ).to(self.device)
            
            # Enable memory efficient attention if available
            if hasattr(self.pipe, 'enable_attention_slicing'):
                self.pipe.enable_attention_slicing()
                
            self.model_loaded = True
            
    def generate_video(
        self, 
        job_id: str, 
        prompt: str, 
        progress_callback: Optional[Callable] = None,
        num_frames: int = 6,
        fps: int = 4,
        inference_steps: int = 4
    ) -> str:
        """Generate video with configurable parameters"""
        
        # Load model if not already loaded
        self.load_model()
        
        output_dir = "./public/videos"
        os.makedirs(output_dir, exist_ok=True)
        
        # Use cache for repeated prompts
        cache_key = hashlib.md5(f"{prompt}_{num_frames}_{inference_steps}".encode()).hexdigest()
        cache_path = f"./cache/{cache_key}.mp4"
        
        if os.path.exists(cache_path):
            print(f"Using cached video for prompt: {prompt[:50]}")
            video_filename = f"{job_id}.mp4"
            video_path = os.path.join(output_dir, video_filename)
            os.link(cache_path, video_path)  # Hard link to save space
            return f"http://localhost:5000/videos/{video_filename}"
        
        print(f"Generating {num_frames} frames for: {prompt[:50]}...")
        
        frames = []
        for i in range(num_frames):
            if progress_callback:
                progress = int((i / num_frames) * 80) + 10
                progress_callback(progress)
                
            # Add slight variation to each frame for animation
            seed = 42 + i * 2
            generator = torch.Generator(device=self.device).manual_seed(seed)
            
            image = self.pipe(
                    prompt,
                    num_inference_steps=inference_steps or 25,
                    guidance_scale=7.5,
                    generator=generator,
                    height=256,
                     width=256
                       ).images[0]
            
            frames.append(np.array(image))
            
            # Clear GPU cache after each frame
            if self.device != "cpu" and torch.cuda.is_available():
                torch.cuda.empty_cache()
                
        # Create video
        video_filename = f"{job_id}.mp4"
        video_path = os.path.join(output_dir, video_filename)
        
        clip = ImageSequenceClip(frames, fps=fps)
        clip.write_videofile(
            video_path, 
            codec="libx264",
            audio=False,
            preset='ultrafast',  # Faster encoding
            threads=4,
            logger=None  # Suppress moviepy logs
        )
        
        # Cache the result
        os.makedirs("./cache", exist_ok=True)
        os.link(video_path, cache_path)
        
        if progress_callback:
            progress_callback(100)
            
        print(f"Video saved: {video_path}")
        return f"http://localhost:5000/videos/{video_filename}"

# Singleton instance
generator = VideoGenerator()

def generate_video(job_id: str, prompt: str, progress_callback=None) -> str:
    return generator.generate_video(job_id, prompt, progress_callback)