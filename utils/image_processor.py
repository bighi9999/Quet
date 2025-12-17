"""
Image Processing Utilities
"""
import base64
import io
from PIL import Image

class ImageProcessor:
    def process_image(self, image_data):
        """Process and optimize uploaded image"""
        try:
            # Decode base64 if needed
            if isinstance(image_data, str):
                if 'base64,' in image_data:
                    image_data = image_data.split('base64,')[1]
                image_bytes = base64.b64decode(image_data)
            else:
                image_bytes = image_data
            
            # Open image
            img = Image.open(io.BytesIO(image_bytes))
            
            # Convert RGBA to RGB if needed
            if img.mode == 'RGBA':
                bg = Image.new('RGB', img.size, (255, 255, 255))
                bg.paste(img, mask=img.split()[3])
                img = bg
            
            # Resize if too large
            max_size = (1024, 1024)
            if img.size[0] > max_size[0] or img.size[1] > max_size[1]:
                img.thumbnail(max_size, Image.Resampling.LANCZOS)
            
            # Save to bytes
            output = io.BytesIO()
            img.save(output, format='JPEG', quality=85, optimize=True)
            processed_bytes = output.getvalue()
            
            return processed_bytes
            
        except Exception as e:
            raise Exception(f"Failed to process image: {str(e)}")
    
    def validate_image(self, image_data):
        """Validate image file"""
        try:
            # Decode and open
            if isinstance(image_data, str):
                if 'base64,' in image_data:
                    image_data = image_data.split('base64,')[1]
                image_bytes = base64.b64decode(image_data)
            else:
                image_bytes = image_data
            
            img = Image.open(io.BytesIO(image_bytes))
            
            return {
                'valid': True,
                'format': img.format,
                'width': img.size[0],
                'height': img.size[1],
                'size': len(image_bytes)
            }
            
        except Exception as e:
            return {
                'valid': False,
                'error': str(e)
            }
    
    def buffer_to_base64(self, buffer):
        """Convert buffer to base64"""
        return base64.b64encode(buffer).decode('utf-8')

# Singleton instance
image_processor = ImageProcessor()
