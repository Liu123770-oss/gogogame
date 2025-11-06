import { _decorator, Component, Node, Prefab, instantiate, Vec3 } from 'cc';
import { NewComponent } from './NewComponent';
const { ccclass, property } = _decorator;

@ccclass('ObstacleManager')
export class ObstacleManager extends Component {
    @property(Prefab)
    obstaclePrefab: Prefab = null; // 障碍物预制体，在编辑器中拖入

    @property(Node)
    playerNode: Node = null; // 玩家节点，在编辑器中拖入

    @property
    spawnInterval: number = 2; // 生成间隔（秒），可在编辑器中调整

    @property
    spawnDistance: number = 20; // 在玩家前方多远的位置生成

    @property
    minZ: number = -4; // Z轴最小值

    @property
    maxZ: number = 4; // Z轴最大值

    @property
    obstacleY: number = 0.5; // 障碍物的Y轴位置

    private _timer: number = 0;
    private _playerComponent: NewComponent = null;

    start() {
        // 获取玩家组件
        if (this.playerNode) {
            this._playerComponent = this.playerNode.getComponent(NewComponent);
        }
    }

    update(deltaTime: number) {
        // 只有在游戏开始且未结束时才生成障碍物
        if (!this._playerComponent || !this._playerComponent.isGameStarted() || this._playerComponent.isGameOver()) {
            return;
        }

        // 计时器累加
        this._timer += deltaTime;

        // 达到生成间隔时，生成新障碍物
        if (this._timer >= this.spawnInterval) {
            this._timer = 0;
            this.spawnObstacle();
        }
    }

    spawnObstacle() {
        if (!this.obstaclePrefab) {
            console.warn('障碍物预制体未设置！');
            return;
        }

        if (!this.playerNode) {
            console.warn('玩家节点未设置！');
            return;
        }

        // 实例化障碍物
        const obstacle = instantiate(this.obstaclePrefab);

        // 获取玩家当前位置
        const playerPos = this.playerNode.position;

        // 随机生成Z轴位置（左右位置）
        const randomZ = this.minZ + Math.random() * (this.maxZ - this.minZ);

        // 在玩家前方生成障碍物（玩家向X轴负方向移动，所以前方是 X - spawnDistance）
        const spawnX = playerPos.x - this.spawnDistance;

        // 设置障碍物位置
        obstacle.setPosition(new Vec3(spawnX, this.obstacleY, randomZ));

        // 添加到场景中
        this.node.scene.addChild(obstacle);

        console.log(`生成障碍物，位置：X=${spawnX.toFixed(2)}, Y=${this.obstacleY}, Z=${randomZ.toFixed(2)}`);
    }
}


