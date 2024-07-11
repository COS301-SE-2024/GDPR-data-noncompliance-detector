from transformers import DetrImageProcessor, DetrForObjectDetection
import torch
from PIL import Image

def biometric_detect_people(source):
    image = Image.open(source)
    if image.mode != 'RGB':
        image = image.convert('RGB')
    # image.show()

    processor = DetrImageProcessor.from_pretrained("facebook/detr-resnet-50", revision="no_timm")
    model = DetrForObjectDetection.from_pretrained("facebook/detr-resnet-50", revision="no_timm")

    inputs = processor(images=image, return_tensors="pt")
    outputs = model(**inputs)


    target_sizes = torch.tensor([image.size[::-1]])
    results = processor.post_process_object_detection(outputs, target_sizes=target_sizes, threshold=0.8)[0]
    output = []

    for score, label, box in zip(results["scores"], results["labels"], results["boxes"]):
        box = [round(i, 2) for i in box.tolist()]
        output.append({"label": model.config.id2label[label.item()], "confidence": round(score.item(), 3)})

    return output


if __name__ == "__main__":
    out = biometric_detect_people("../mockdata/p3.png")
    print(out)