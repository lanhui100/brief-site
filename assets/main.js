/**
 * 招聘AI助理 - 主交互脚本
 */

// 初始化 Lucide 图标
lucide.createIcons();

// 放大镜交互逻辑
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('report-container');
    const magnifier = document.getElementById('dynamic-magnifier');

    if (!container || !magnifier) return;

    // 仅在桌面端启用放大镜
    if (window.innerWidth < 768) {
        magnifier.style.display = 'none';
        return;
    }

    const img = container.querySelector('img');

    // 获取图片的实际显示尺寸和位置
    function getImgRect() {
        return img.getBoundingClientRect();
    }

    // 更新放大镜背景尺寸
    function updateMagnifierBackground() {
        const imgRect = getImgRect();
        // 2.5倍放大，所以背景图尺寸是容器尺寸的 2.5 倍
        const bgWidth = imgRect.width * 2.5;
        const bgHeight = imgRect.height * 2.5;
        magnifier.style.backgroundSize = `${bgWidth}px ${bgHeight}px`;
    }

    // 初始化背景尺寸
    updateMagnifierBackground();

    // 将放大镜重置到预设的初始位置（平缓过渡）
    function resetMagnifierToTopLeft() {
        const imgRect = getImgRect();
        const containerRect = container.getBoundingClientRect();
        const magnifierRadius = magnifier.offsetWidth / 2;

        // 预设的初始位置百分比（相对于图片）
        const initPercentX = 0.114; // 11.4%
        const initPercentY = 0.118; // 11.8%

        // 计算图片内目标点相对于容器的位置
        const imgOffsetX = imgRect.left - containerRect.left;
        const imgOffsetY = imgRect.top - containerRect.top;
        const targetX = imgOffsetX + imgRect.width * initPercentX;
        const targetY = imgOffsetY + imgRect.height * initPercentY;

        // 放大镜中心对准目标点
        magnifier.style.left = (targetX - magnifierRadius) + 'px';
        magnifier.style.top = (targetY - magnifierRadius) + 'px';

        // 计算背景位置（2.5倍放大）
        const bgX = -imgRect.width * initPercentX * 2.5 + magnifierRadius;
        const bgY = -imgRect.height * initPercentY * 2.5 + magnifierRadius;
        magnifier.style.backgroundPosition = `${bgX}px ${bgY}px`;

        // 移除 following 类，启用过渡效果
        magnifier.classList.remove('following');
    }

    // 初始化时将放大镜定位到图片左上角
    resetMagnifierToTopLeft();

    // 鼠标移动时更新放大镜位置
    container.addEventListener('mousemove', function(e) {
        const imgRect = getImgRect();
        const magnifierRadius = magnifier.offsetWidth / 2;

        // 计算鼠标相对于图片的位置
        const mouseX = e.clientX - imgRect.left;
        const mouseY = e.clientY - imgRect.top;

        // 检查鼠标是否在图片范围内
        if (mouseX < 0 || mouseX > imgRect.width || mouseY < 0 || mouseY > imgRect.height) {
            resetMagnifierToTopLeft();
            return;
        }

        // 添加 following 类，取消过渡效果实现即时跟随
        magnifier.classList.add('following');

        // 显示放大镜
        magnifier.style.display = 'block';

        // 计算放大镜位置（使其相对于容器定位，居中于鼠标）
        const containerRect = container.getBoundingClientRect();
        const magnifierX = e.clientX - containerRect.left - magnifierRadius;
        const magnifierY = e.clientY - containerRect.top - magnifierRadius;

        magnifier.style.left = magnifierX + 'px';
        magnifier.style.top = magnifierY + 'px';

        // 计算背景位置
        // 背景图尺寸是原图的 2.5 倍
        const bgWidth = imgRect.width * 2.5;
        const bgHeight = imgRect.height * 2.5;

        // 背景位置需要补偿放大镜圆心的偏移
        // 背景图的 (0,0) 对应图片的左上角
        // 我们需要显示的是以鼠标为中心的区域
        const bgX = -mouseX * 2.5 + magnifierRadius;
        const bgY = -mouseY * 2.5 + magnifierRadius;

        magnifier.style.backgroundPosition = `${bgX}px ${bgY}px`;
    });

    // 鼠标离开容器时将放大镜重置到左上角
    container.addEventListener('mouseleave', function() {
        resetMagnifierToTopLeft();
    });

    // 窗口大小改变时更新背景尺寸
    window.addEventListener('resize', function() {
        updateMagnifierBackground();
        resetMagnifierToTopLeft();
    });
});
