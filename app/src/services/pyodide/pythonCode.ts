export const PYTHON_CODE = `
from PIL import Image, ImageDraw, ImageFont
import io
import base64

def apply_orientation(img, orientation):
    if orientation == 2:
        return img.transpose(Image.FLIP_LEFT_RIGHT)
    elif orientation == 3:
        return img.rotate(180)
    elif orientation == 4:
        return img.transpose(Image.FLIP_TOP_BOTTOM)
    elif orientation == 5:
        return img.transpose(Image.FLIP_LEFT_RIGHT).rotate(90, expand=True)
    elif orientation == 6:
        return img.rotate(270, expand=True)
    elif orientation == 7:
        return img.transpose(Image.FLIP_LEFT_RIGHT).rotate(270, expand=True)
    elif orientation == 8:
        return img.rotate(90, expand=True)
    return img

def rgba_to_thumbnail(rgba_base64, width, height, max_size=200):
    rgba_bytes = base64.b64decode(rgba_base64)
    img = Image.frombytes("RGBA", (width, height), rgba_bytes)
    img = img.convert("RGB")
    img.thumbnail((max_size, max_size))
    buffer = io.BytesIO()
    img.save(buffer, format="JPEG", quality=70)
    return base64.b64encode(buffer.getvalue()).decode('utf-8')

def add_timestamp(input_base64, date_str, orientation=1):
    image_bytes = base64.b64decode(input_base64)
    img = Image.open(io.BytesIO(image_bytes))
    img = img.convert("RGBA")
    img = apply_orientation(img, orientation)
    
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    color = (255, 160, 50, 200)
    font = ImageFont.load_default()
    
    bbox = font.getbbox(date_str)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    target_height = int(min(img.width, img.height) * 0.04)
    scale = target_height / text_height if text_height > 0 else 1
    
    margin = int(min(img.width, img.height) * 0.03)
    x = img.width - int(text_width * scale) - margin
    y = img.height - int(text_height * scale) - margin
    
    txt_img = Image.new("RGBA", (text_width + 2, text_height + 2), (0, 0, 0, 0))
    txt_draw = ImageDraw.Draw(txt_img)
    txt_draw.text((0, 0), date_str, font=font, fill=color)
    
    scaled_size = (int(txt_img.width * scale), int(txt_img.height * scale))
    txt_img = txt_img.resize(scaled_size, Image.BILINEAR)
    
    overlay.paste(txt_img, (x, y), txt_img)
    
    result = Image.alpha_composite(img, overlay)
    result = result.convert("RGB")
    
    buffer = io.BytesIO()
    result.save(buffer, format="JPEG", quality=85)
    return base64.b64encode(buffer.getvalue()).decode('utf-8')

def add_timestamp_from_rgba(rgba_base64, width, height, date_str, orientation=1):
    rgba_bytes = base64.b64decode(rgba_base64)
    img = Image.frombytes("RGBA", (width, height), rgba_bytes)
    img = apply_orientation(img, orientation)
    
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    color = (255, 160, 50, 200)
    font = ImageFont.load_default()
    
    bbox = font.getbbox(date_str)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    target_height = int(min(img.width, img.height) * 0.04)
    scale = target_height / text_height if text_height > 0 else 1
    
    margin = int(min(img.width, img.height) * 0.03)
    x = img.width - int(text_width * scale) - margin
    y = img.height - int(text_height * scale) - margin
    
    txt_img = Image.new("RGBA", (text_width + 2, text_height + 2), (0, 0, 0, 0))
    txt_draw = ImageDraw.Draw(txt_img)
    txt_draw.text((0, 0), date_str, font=font, fill=color)
    
    scaled_size = (int(txt_img.width * scale), int(txt_img.height * scale))
    txt_img = txt_img.resize(scaled_size, Image.BILINEAR)
    
    overlay.paste(txt_img, (x, y), txt_img)
    
    result = Image.alpha_composite(img, overlay)
    result = result.convert("RGB")
    
    buffer = io.BytesIO()
    result.save(buffer, format="JPEG", quality=85)
    return base64.b64encode(buffer.getvalue()).decode('utf-8')
`
