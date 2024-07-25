from transformers import DetrImageProcessor, DetrForObjectDetection
import torch
from PIL import Image
import sys
import os
import docx2txt


# below added because of the relative import error
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from backend.Document_parser.extract_images import extract_images_from_pdf
from backend.Document_parser.extract_images import extract_images_from_docx

from retinaface import RetinaFace

# from tensorflow.python.framework.ops import disable_eager_execution
# disable_eager_execution()


def save_model_local():
    processor = DetrImageProcessor.from_pretrained("facebook/detr-resnet-50", revision="no_timm")
    model = DetrForObjectDetection.from_pretrained("facebook/detr-resnet-50", revision="no_timm")

    processor.save_pretrained('./local_model/detr_image_processor')
    model.save_pretrained('./local_model/detr_for_object_detection')


def biometric_detect_people(source):
    image = Image.open(source)
    if image.mode != 'RGB':
        image = image.convert('RGB')
    # image.show()

    try:
        processor = DetrImageProcessor.from_pretrained('./local_model/detr_image_processor')
        model = DetrForObjectDetection.from_pretrained('./local_model/detr_for_object_detection')
    except (EnvironmentError, ValueError):
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


def biometric_detect_eye(source):
    resp = RetinaFace.detect_faces(source)
    return resp


def biometric_detect_all(pdf_path):
    if (pdf_path.endswith('.pdf')):
        extract_images_from_pdf(pdf_path)
        images = [f'extracted_images/pdf_images/{i}' for i in os.listdir('extracted_images/pdf_images')]
        output = []
        for image in images:
            output.append(biometric_detect_people(image))
        
        return output
    
    elif (pdf_path.endswith('.docx')):
        extract_images_from_docx(pdf_path)
        images = [f'extracted_images/docx_images/{i}' for i in os.listdir('extracted_images/docx_images')]
        output = []
        for image in images:
            output.append(biometric_detect_people(image))
        return output




if __name__ == "__main__":
    # out = biometric_detect_people("../mockdata/p2.png")
    # print(out)

    # print(biometric_detect_eye("../mockdata/p2.png"))
    # save_model_local()

    # extract_images()
    print(biometric_detect_all("../mockdata/docxWimages.docx"))
