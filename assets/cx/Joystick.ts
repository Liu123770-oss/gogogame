import { _decorator, Component, Node, Vec3, Input, EventTouch, UITransform } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 虚拟摇杆组件
 * 用于手机端触摸控制
 */
@ccclass('Joystick')
export class Joystick extends Component {
    @property(Node)
    joystickBg: Node = null!; // 摇杆背景

    @property(Node)
    joystickHandle: Node = null!; // 摇杆把手

    @property
    maxRadius: number = 100; // 摇杆最大半径（像素）

    private _inputDirection: Vec3 = new Vec3(0, 0, 0); // 当前输入方向 (-1 到 1)
    private _touching: boolean = false; // 是否正在触摸
    private _initialPos: Vec3 = new Vec3(); // 摇杆初始位置
    private _tempVec3: Vec3 = new Vec3();

    start() {
        // 保存摇杆把手的初始位置
        this._initialPos.set(this.joystickHandle.position);

        // 注册触摸事件
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onDestroy() {
        // 移除事件监听
        this.node.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        this._touching = true;
        this.updateJoystickPosition(event);
    }

    onTouchMove(event: EventTouch) {
        if (!this._touching) return;
        this.updateJoystickPosition(event);
    }

    onTouchEnd(event: EventTouch) {
        this._touching = false;
        // 重置摇杆位置
        this.joystickHandle.setPosition(this._initialPos);
        // 重置输入方向
        this._inputDirection.set(0, 0, 0);
    }

    updateJoystickPosition(event: EventTouch) {
        const uiTransform = this.joystickBg.getComponent(UITransform);
        if (!uiTransform) return;

        // 获取触摸点在摇杆背景中的本地坐标
        const touchPos = uiTransform.convertToNodeSpaceAR(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));

        // 计算偏移距离
        const distance = touchPos.length();

        // 限制在最大半径内
        if (distance > this.maxRadius) {
            touchPos.normalize();
            touchPos.multiplyScalar(this.maxRadius);
        }

        // 更新摇杆把手位置
        this._tempVec3.set(touchPos.x, touchPos.y, 0);
        this.joystickHandle.setPosition(this._tempVec3);

        // 计算输入方向（归一化）
        if (distance > 0) {
            this._inputDirection.set(
                touchPos.x / this.maxRadius,  // X方向（左右）
                0,
                touchPos.y / this.maxRadius   // Y方向对应Z轴（上下）
            );
        } else {
            this._inputDirection.set(0, 0, 0);
        }
    }

    /**
     * 获取当前输入方向
     * @returns Vec3 方向向量 (x, 0, z)，范围 -1 到 1
     */
    getDirection(): Vec3 {
        return this._inputDirection.clone();
    }

    /**
     * 是否正在触摸
     */
    isTouching(): boolean {
        return this._touching;
    }
}

