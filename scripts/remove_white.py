from PIL import Image

def remove_white(img_path):
    img = Image.open(img_path)
    img = img.convert("RGBA")
    datas = img.getdata()
    
    newData = []
    # If the pixel is close to white, make it transparent
    for item in datas:
        # item is (R, G, B, A)
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(img_path, "PNG")

for path in ["public/sponsors/asas-updated.png", "public/sponsors/image-masters.png", "public/sponsors/hisense-updated.png"]:
    try:
        remove_white(path)
        print("Processed", path)
    except Exception as e:
        print("Error processing", path, e)
