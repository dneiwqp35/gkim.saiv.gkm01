document.addEventListener('DOMContentLoaded', function() {
    // 获取所有购买按钮
    const buyButtons = document.querySelectorAll('.buy-btn');
    
    // 为每个按钮添加点击事件
    buyButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const plans = [
                {
                    name: '基础版',
                    price: 29.9,
                    period: '月',
                    features: ['AI内容检测', '相似度对比', '基础降AI功能', '每日1000字限制']
                },
                {
                    name: '专业版',
                    price: 59.9,
                    period: '月',
                    features: ['包含基础版所有功能', '论文AI检测', '降AI2.0功能', '每日10000字限制']
                },
                {
                    name: '企业版',
                    price: 199.9,
                    period: '月',
                    features: ['包含专业版所有功能', '智能改写功能', '无字数限制', '专属客服支持']
                }
            ];

            const selectedPlan = plans[index];
            
            // 检查用户是否已登录
            if (!isUserLoggedIn()) {
                // 如果未登录，跳转到登录页面并保存选择的套餐信息
                localStorage.setItem('selectedPlan', JSON.stringify(selectedPlan));
                window.location.href = 'login.html?redirect=pricing';
                return;
            }

            // 已登录，显示支付确认弹窗
            showPaymentModal(selectedPlan);
        });
    });

    // 检查用户是否登录
    function isUserLoggedIn() {
        // 这里应该根据你的实际登录状态判断逻辑来实现
        // 示例中使用 localStorage 存储登录状态
        return localStorage.getItem('userLoggedIn') === 'true';
    }

    // 显示支付确认弹窗
    function showPaymentModal(plan) {
        // 创建模态框
        const modal = document.createElement('div');
        modal.className = 'payment-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>确认购买</h2>
                <div class="plan-details">
                    <h3>${plan.name}</h3>
                    <p class="price">￥${plan.price}/${plan.period}</p>
                    <ul>
                        ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                <div class="payment-methods">
                    <h4>选择支付方式</h4>
                    <div class="payment-options">
                        <label>
                            <input type="radio" name="payment" value="wechat" checked>
                            <span>微信支付</span>
                        </label>
                        <label>
                            <input type="radio" name="payment" value="alipay">
                            <span>支付宝</span>
                        </label>
                    </div>
                </div>
                <div class="modal-buttons">
                    <button class="cancel-btn">取消</button>
                    <button class="confirm-btn">确认支付</button>
                </div>
            </div>
        `;

        // 添加模态框样式
        const style = document.createElement('style');
        style.textContent = `
            .payment-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }

            .modal-content {
                background: white;
                padding: 30px;
                border-radius: 8px;
                max-width: 500px;
                width: 90%;
            }

            .plan-details {
                margin: 20px 0;
                padding: 15px;
                background: #f5f5f5;
                border-radius: 4px;
            }

            .price {
                font-size: 24px;
                color: #1677ff;
                margin: 10px 0;
            }

            .payment-methods {
                margin: 20px 0;
            }

            .payment-options {
                display: flex;
                gap: 20px;
                margin-top: 10px;
            }

            .modal-buttons {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                margin-top: 20px;
            }

            .cancel-btn, .confirm-btn {
                padding: 8px 20px;
                border-radius: 4px;
                cursor: pointer;
                border: none;
            }

            .cancel-btn {
                background: #f5f5f5;
            }

            .confirm-btn {
                background: #1677ff;
                color: white;
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(modal);

        // 添加按钮事件
        const cancelBtn = modal.querySelector('.cancel-btn');
        const confirmBtn = modal.querySelector('.confirm-btn');

        cancelBtn.addEventListener('click', () => {
            modal.remove();
        });

        confirmBtn.addEventListener('click', () => {
            const paymentMethod = modal.querySelector('input[name="payment"]:checked').value;
            processPayment(plan, paymentMethod);
        });
    }

    // 处理支付
    function processPayment(plan, paymentMethod) {
        // 这里应该调用实际的支付接口
        // 示例中显示一个支付二维码
        const modal = document.querySelector('.payment-modal');
        modal.querySelector('.modal-content').innerHTML = `
            <h2>请扫码支付</h2>
            <div class="qr-code" style="text-align: center; margin: 20px 0;">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" 
                     alt="支付二维码" 
                     style="width: 200px; height: 200px;">
            </div>
            <p style="text-align: center;">支付金额：￥${plan.price}</p>
            <div class="modal-buttons">
                <button class="cancel-btn">取消支付</button>
            </div>
        `;

        const cancelBtn = modal.querySelector('.cancel-btn');
        cancelBtn.addEventListener('click', () => {
            modal.remove();
        });

        // 模拟支付成功
        setTimeout(() => {
            alert('支付成功！');
            modal.remove();
            // 这里可以添加购买成功后的处理逻辑
            // 例如更新用户会员状态、跳转到会员中心等
        }, 3000);
    }
}); 