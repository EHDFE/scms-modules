import downloadImage from './img/download.png';
import visibleIcon from './img/visible.png';
import recycleIcon from './img/recycle.png';
import fileIcon from './img/file.png';

export default `<div class="kaImageUploadDirective">
    <ul>
        <li ng-repeat="item in urls" ng-class="{'btnLoading': isDownloading}">
            <div class="form-opera">
                <a ng-href="{{item.url}}" ng-if="!isimg(item.name) " ><img src="${downloadImage}" ></a>
                
                <img ng-if="isimg(item.name)" src="${visibleIcon}" ng-click="showBig($event,item.url);">
                <img ng-if="isimg(item.name)" class="img-show" text-only="false" image-show img-url="item.url" alt-text="item.name" click-fun="clickFun" >
                <img ng-if="canEdit" class="ml10" src="${recycleIcon}" ng-click="remove($index)" alt="">
            </div>
            <div class="form-file" ng-if="!isimg(item.name) && item.id">
                <img src="${fileIcon}" imageonload="loadImage()">
                <span>查看附件</span>
            </div>
            <img ng-if="isimg(item.name)" class="uploadImage" ng-src="{{item.url}}" imageonload="loadImage()">
            
        </li>
        <li ng-if="!canEdit && !urls.length">
            <span>暂无图片</span>
        </li>
        <li class="btnAddIcon"  ng-show="canEdit && urls.length < dMax" >
            <span>上传</span>
            <input class="file" type="file"  accept="image/png,image/jpg,image/jpeg">
        </li>
    </ul>
</div>`;