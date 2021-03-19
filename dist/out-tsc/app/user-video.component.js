import { __decorate } from "tslib";
import { Component, Input } from '@angular/core';
let UserVideoComponent = class UserVideoComponent {
    getNicknameTag() {
        // return JSON.parse(this.streamManager.stream.connection.data).clientData;
    }
};
__decorate([
    Input()
], UserVideoComponent.prototype, "streamManager", void 0);
UserVideoComponent = __decorate([
    Component({
        selector: 'user-video',
        styles: [`
        ov-video {
            width: 100%;
            height: auto;
            float: left;
            cursor: pointer;
        }
        div div {
            position: absolute;
            background: #f8f8f8;
            padding-left: 5px;
            padding-right: 5px;
            color: #777777;
            font-weight: bold;
            border-bottom-right-radius: 4px;
        }
        p {
            margin: 0;
        }`],
        template: `
        <div>
            <ov-video [streamManager]="streamManager"></ov-video>
            <div><p>{{getNicknameTag()}}</p></div>
        </div>`
    })
], UserVideoComponent);
export { UserVideoComponent };
//# sourceMappingURL=user-video.component.js.map