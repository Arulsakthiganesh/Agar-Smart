import numpy as np
import io
import base64

try:
    from PIL import Image, ImageDraw, ImageFont
    HAS_PIL = True
except ImportError:
    HAS_PIL = False

def process_drone_image_simulation(image_bytes: bytes = None, filename: str = "drone_scan.jpg"):
    """
    Simulates AI Building Extraction, Boundary Segmentation, and Vertical Floor Delineation
    with OpenCV / PIL visualization and realistic confidence metrics.
    """
    if HAS_PIL:
        if image_bytes:
            try:
                img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            except Exception:
                img = Image.new("RGB", (800, 600), color=(30, 41, 59))
        else:
            img = Image.new("RGB", (800, 600), color=(30, 41, 59))
        
        draw = ImageDraw.Draw(img)
        w, h = img.size
    else:
        w, h = 800, 600

    
    # Draw simulated building footprints (Cyan/Green boxes)
    buildings = [
        {"id": "BLD-0001", "box": [w*0.15, h*0.2, w*0.45, h*0.55], "floors": 8, "confidence": 96.4, "name": "BHUMI Residency"},
        {"id": "BLD-0002", "box": [w*0.55, h*0.18, w*0.85, h*0.48], "floors": 5, "confidence": 94.8, "name": "Cauvery Heights"},
        {"id": "BLD-0003", "box": [w*0.2, h*0.62, w*0.48, h*0.88], "floors": 4, "confidence": 92.1, "name": "Adyar Plaza"},
        {"id": "BLD-0004", "box": [w*0.58, h*0.58, w*0.82, h*0.85], "floors": 6, "confidence": 95.3, "name": "Tech Hub Tower"}
    ]
    
    # Draw parcel boundary lines (Orange dash/solid)
    parcels = [
        {"id": "PCL-0001", "box": [w*0.1, h*0.12, w*0.5, h*0.58], "confidence": 97.1},
        {"id": "PCL-0002", "box": [w*0.52, h*0.12, w*0.9, h*0.52], "confidence": 95.9},
        {"id": "PCL-0003", "box": [w*0.12, h*0.58, w*0.52, h*0.92], "confidence": 96.5}
    ]
    
    if HAS_PIL:
        for p in parcels:
            b = p["box"]
            draw.rectangle(b, outline="#f59e0b", width=3)
            draw.text((b[0]+5, b[1]+5), f"Parcel {p['id']} ({p['confidence']}%)", fill="#fbbf24")

        for bldg in buildings:
            box = bldg["box"]
            draw.rectangle(box, outline="#06b6d4", width=3)
            draw.text((box[0]+10, box[1]+10), f"Building: {bldg['name']}", fill="#38bdf8")
            draw.text((box[0]+10, box[1]+28), f"Floors: {bldg['floors']} | Conf: {bldg['confidence']}%", fill="#a5f3fc")
        
        buffer = io.BytesIO()
        img.save(buffer, format="JPEG")
        overlay_base64 = f"data:image/jpeg;base64,{base64.b64encode(buffer.getvalue()).decode('utf-8')}"
    else:
        fake_svg = '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="800" height="600" fill="#0f172a"/><text x="20" y="40" fill="#38bdf8" font-size="20">AI Drone Building Overlay</text></svg>'
        overlay_base64 = f"data:image/svg+xml;base64,{base64.b64encode(fake_svg.encode()).decode()}"

    
    return {
        "filename": filename,
        "pipeline_steps": [
            {"name": "Image Preprocessing & Raster Normalization", "status": "Completed", "time_ms": 120},
            {"name": "Building Footprint Extraction (YOLOv8-Geo)", "status": "Completed", "confidence": 96.4},
            {"name": "2D/3D Parcel Boundary Delineation", "status": "Completed", "confidence": 97.1},
            {"name": "Vertical Floor & Unit Segmentation", "status": "Completed", "confidence": 93.7},
            {"name": "3D Cadastral Topology Validation", "status": "Completed", "confidence": 98.2}
        ],
        "summary": {
            "buildings_detected": len(buildings),
            "parcels_detected": len(parcels),
            "roads_detected": 4,
            "average_confidence": 96.35,
            "estimated_built_up_area_sqft": 64500,
            "vertical_levels_identified": 23
        },
        "detected_buildings": buildings,
        "overlay_image": overlay_base64
    }
