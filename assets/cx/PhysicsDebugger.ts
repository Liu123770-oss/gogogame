import { _decorator, Component, Node, director, PhysicsSystem } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 物理系统调试器 - 用于检查物理系统配置
 * 将此组件添加到任意节点（如摄像机）上，游戏启动时会打印物理系统状态
 */
@ccclass('PhysicsDebugger')
export class PhysicsDebugger extends Component {
    
    start() {
        this.scheduleOnce(() => {
            this.checkPhysicsSystem();
        }, 0.5); // 延迟0.5秒执行，确保所有节点都已初始化
    }

    checkPhysicsSystem() {
        console.log('');
        console.log('╔════════════════════════════════════════════╗');
        console.log('║     🔍 物理系统状态检查                    ║');
        console.log('╚════════════════════════════════════════════╝');
        console.log('');

        // 检查物理系统是否启用
        const physicsSystem = PhysicsSystem.instance;
        if (physicsSystem) {
            console.log('✅ 物理系统已启用');
            console.log('  - 重力:', (physicsSystem as any).gravity?.toString() || '未设置');
            console.log('  - 是否允许休眠:', (physicsSystem as any).allowSleep);
            console.log('  - 固定时间步:', (physicsSystem as any).fixedTimeStep);
        } else {
            console.error('❌ 物理系统未启用！');
            console.error('   请在编辑器中：项目设置 → 功能裁剪 → 勾选物理系统');
            return;
        }

        console.log('');
        console.log('────────────────────────────────────────────');
        console.log('  场景中的碰撞器检查');
        console.log('────────────────────────────────────────────');

        // 遍历场景中所有节点，查找碰撞器
        const scene = director.getScene();
        let colliderCount = 0;
        let rigidBodyCount = 0;

        scene.walk((node: Node) => {
            const colliders = node.getComponents('cc.Collider');
            const rigidBodies = node.getComponents('cc.RigidBody');

            if (colliders.length > 0) {
                colliderCount++;
                console.log('');
                console.log(`📦 节点: "${node.name}"`);
                console.log(`  - 位置: ${node.worldPosition.toString()}`);
                
                colliders.forEach((collider: any, index: number) => {
                    console.log(`  - 碰撞器 #${index + 1}:`);
                    console.log(`    • 类型: ${collider.constructor.name}`);
                    console.log(`    • 是否启用: ${collider.enabled}`);
                    console.log(`    • Is Trigger: ${collider.isTrigger}`);
                    if (collider.size) {
                        console.log(`    • 尺寸: ${collider.size.toString()}`);
                    }
                    if (collider.center) {
                        console.log(`    • 中心: ${collider.center.toString()}`);
                    }
                });
            }

            if (rigidBodies.length > 0) {
                rigidBodyCount++;
                rigidBodies.forEach((rb: any, index: number) => {
                    console.log(`  - 刚体 #${index + 1}:`);
                    console.log(`    • 类型: ${rb.type} (0=Static, 1=Dynamic, 2=Kinematic)`);
                    console.log(`    • 质量: ${rb.mass}`);
                    console.log(`    • 是否启用: ${rb.enabled}`);
                });
            }
        });

        console.log('');
        console.log('────────────────────────────────────────────');
        console.log(`  总计: ${colliderCount} 个碰撞器, ${rigidBodyCount} 个刚体`);
        console.log('────────────────────────────────────────────');

        // 检查关键问题
        console.log('');
        console.log('🔧 检查结果:');
        
        if (colliderCount === 0) {
            console.error('  ❌ 场景中没有找到任何碰撞器！');
        } else {
            console.log(`  ✅ 找到 ${colliderCount} 个碰撞器`);
        }

        if (rigidBodyCount === 0) {
            console.error('  ❌ 场景中没有找到任何刚体！');
            console.error('     碰撞检测需要至少一个刚体组件！');
        } else {
            console.log(`  ✅ 找到 ${rigidBodyCount} 个刚体`);
        }

        if (colliderCount < 2) {
            console.warn('  ⚠️ 碰撞器数量少于2个，无法进行碰撞检测');
        }

        console.log('');
        console.log('╔════════════════════════════════════════════╗');
        console.log('║     检查完成                                ║');
        console.log('╚════════════════════════════════════════════╝');
        console.log('');
    }
}

