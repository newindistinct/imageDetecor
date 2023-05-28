import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FaceDetector, FilesetResolver, Detection } from '@mediapipe/tasks-vision';

@Component({
  selector: 'app-detec-image',
  templateUrl: './detec-image.page.html',
  styleUrls: ['./detec-image.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DetecImagePage implements OnInit {
  @ViewChild('video', { static: false })
  public video: ElementRef<HTMLVideoElement>;

  @ViewChild('canvas', { static: false })
  public canvas: ElementRef<HTMLCanvasElement>;

  @ViewChild('image', { static: false })
  public image: ElementRef<HTMLImageElement>;

  score: number;
  faceDetector: FaceDetector;

  constructor() { }

  ngOnInit() {
    this.initialization();
  }

  async initialization() {
    const vision = await FilesetResolver.forVisionTasks(
      // path/to/wasm/root
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );
    console.log("vision", vision);
    console.log("image", this.image);
    this.faceDetector = await FaceDetector.createFromOptions(
      vision,
      {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite`
        },
        runningMode: 'IMAGE'
      });
    console.log("faceDetector", this.faceDetector);
  }

  async handleClick() {
    const resultElement = this.image.nativeElement;

    const faceDetectorResult = this.faceDetector.detect(this.image.nativeElement);
    console.log(faceDetectorResult.detections);

    faceDetectorResult.detections.forEach((detection) => {

      const ratio = 1
      // this.image.nativeElement.height / this.image.nativeElement.naturalHeight;

      console.log('height', this.image.nativeElement.height);
      console.log('naturalHeight', this.image.nativeElement.naturalHeight);
      console.log('ratio', ratio);
      console.log(detection.categories[0].score);
      this.score = Number(detection.categories[0].score);
      console.log(detection.boundingBox?.originX);

      const p = document.createElement("p");
      p.setAttribute("class", "info");
      p.innerText = "Confidence: " + Math.round(this.score * 100) + "%";
      p.style.cssText = `
                          color : #fff; 
                          position: absolute;
                          left : ${Number(detection.boundingBox?.originX) * ratio}px;
                          top : ${Number(detection.boundingBox?.originY) * ratio}px;
                          width : ${Number(detection.boundingBox?.width) * ratio}px;
                          height : 20px;
                           `
      const highlighter = document.createElement("div");
      highlighter.setAttribute("class", "highlighter");
      highlighter.style.cssText = `
                          background: rgba(0, 255, 0, 0.25);
                          border: 1px dashed #fff;
                          z-index: 1;
                          position: absolute;
                          opacity: 0.3;
                          left : ${Number(detection.boundingBox?.originX) * ratio}px;
                          top : ${Number(detection.boundingBox?.originY) * ratio}px;
                          width : ${Number(detection.boundingBox?.width) * ratio}px;
                          height : ${Number(detection.boundingBox?.height) * ratio}px;
                           `;
      resultElement.parentNode?.appendChild(highlighter);
      resultElement.parentNode?.appendChild(p);
      detection.keypoints?.forEach((keypoint) => {
        const keypointEl = document.createElement("spam");
        keypointEl.className = "key-point";
        keypointEl.style.cssText = `
                          position: absolute;
                          z-index: 1;
                          width: 3px;
                          height: 3px;
                          background-color: #ff0000;
                          border-radius: 50%;
                          display: block;
                          left : ${keypoint.x * resultElement.width - 3}px;
                          top : ${keypoint.y * resultElement.height - 3}px;
                           `
        resultElement.parentNode?.appendChild(keypointEl);
      })
    })
  }
}
