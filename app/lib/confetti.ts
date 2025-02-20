import confetti from "canvas-confetti";

// 基础随机函数
function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

// 样式1：多次发射的扇形烟花
function styleOne() {
    const count = 200;
    const defaults = {
        origin: { y: 0.7 },
    };

    function fire(particleRatio: number, opts: any) {
        confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio),
        });
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });
    fire(0.2, {
        spread: 60,
    });
    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });
}

// 样式2：持续下雨的烟花
function styleTwo() {
    const duration = 5 * 1000; // 改为5秒，避免太长
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
    }, 250);
}

// 样式3：两侧喷射
function styleThree() {
    const duration = 5 * 1000; // 改为5秒
    const end = Date.now() + duration;
    const colors = ["#bb0000", "#ffffff"];

    const frame = () => {
        confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors,
        });
        confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors,
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    };

    frame();
}

// 样式4：简单随机
function styleFour() {
    confetti({
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        particleCount: randomInRange(50, 100),
        origin: { y: 0.6 },
    });
}

// 导出主函数
export function showRandomConfetti() {
    // 随机选择一个样式
    const styles = [styleOne, styleTwo, styleThree, styleFour];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    randomStyle();
}
