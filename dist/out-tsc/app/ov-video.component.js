import { __decorate } from "tslib";
import { Component, Input, ViewChild } from '@angular/core';
let OpenViduVideoComponent = class OpenViduVideoComponent {
    ngAfterViewInit() {
        this._streamManager.addVideoElement(this.elementRef.nativeElement);
    }
    set streamManager(streamManager) {
        this._streamManager = streamManager;
        if (!!this.elementRef) {
            this._streamManager.addVideoElement(this.elementRef.nativeElement);
        }
    }
};
__decorate([
    ViewChild('videoElement')
], OpenViduVideoComponent.prototype, "elementRef", void 0);
__decorate([
    Input()
], OpenViduVideoComponent.prototype, "streamManager", null);
OpenViduVideoComponent = __decorate([
    Component({
        selector: 'ov-video',
        template: '<video #videoElement></video>'
    })
], OpenViduVideoComponent);
export { OpenViduVideoComponent };
//# sourceMappingURL=ov-video.component.js.map