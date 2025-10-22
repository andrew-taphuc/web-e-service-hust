// Đợi DOM load xong trước khi thực thi JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Lấy các phần tử DOM
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const addProductBtn = document.getElementById('addProductBtn');
    const addProductSection = document.getElementById('addProductSection');
    const addProductForm = document.getElementById('addProductForm');
    const productsGrid = document.querySelector('.products-grid');
    
    // Chức năng tìm kiếm sản phẩm
    function searchProducts() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const productItems = document.querySelectorAll('.product-item');
        
        productItems.forEach(function(product) {
            const productName = product.querySelector('h3').textContent.toLowerCase();
            
            if (productName.includes(searchTerm)) {
                product.style.display = 'flex';
            } else {
                product.style.display = 'none';
            }
        });
    }
    
    // Chức năng toggle form thêm sản phẩm
    function toggleAddProductForm() {
        if (addProductSection.classList.contains('hidden')) {
            addProductSection.classList.remove('hidden');
            addProductBtn.textContent = 'Đóng form';
        } else {
            addProductSection.classList.add('hidden');
            addProductBtn.textContent = 'Thêm sản phẩm';
            // Reset form khi đóng
            addProductForm.reset();
        }
    }
    
    // Chức năng thêm sản phẩm mới
    function addNewProduct(event) {
        event.preventDefault();
        
        const productName = document.getElementById('productName').value;
        const productImage = document.getElementById('productImage').value;
        const productDescription = document.getElementById('productDescription').value;
        const productPrice = document.getElementById('productPrice').value;
        
        // Tạo phần tử sản phẩm mới
        const newProduct = document.createElement('article');
        newProduct.className = 'product-item';
        newProduct.innerHTML = `
            <img src="${productImage}" alt="${productName}" width="150" height="150">
            <h3>${productName}</h3>
            <p>${productDescription}</p>
            <p><strong>Giá: ${productPrice}</strong></p>
        `;
        
        // Thêm sản phẩm vào grid
        productsGrid.appendChild(newProduct);
        
        // Reset form và ẩn form
        addProductForm.reset();
        addProductSection.classList.add('hidden');
        addProductBtn.textContent = 'Thêm sản phẩm';
        
        // Hiển thị thông báo thành công
        showSuccessMessage('Sản phẩm đã được thêm thành công!');
    }
    
    // Hiển thị thông báo thành công
    function showSuccessMessage(message) {
        const successMsg = document.createElement('div');
        successMsg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(40, 167, 69, 0.4);
            z-index: 1000;
            font-weight: 500;
            animation: slideIn 0.3s ease;
        `;
        successMsg.textContent = message;
        
        // Thêm animation CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(successMsg);
        
        // Tự động ẩn sau 3 giây
        setTimeout(() => {
            successMsg.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => {
                document.body.removeChild(successMsg);
                document.head.removeChild(style);
            }, 300);
        }, 3000);
    }
    
    // Gắn sự kiện cho nút tìm kiếm
    searchBtn.addEventListener('click', searchProducts);
    
    // Gắn sự kiện cho ô input tìm kiếm (tìm kiếm real-time)
    searchInput.addEventListener('keyup', function(event) {
        // Tìm kiếm khi nhấn Enter hoặc khi có thay đổi
        if (event.key === 'Enter' || event.keyCode === 13) {
            searchProducts();
        } else {
            // Tìm kiếm real-time khi gõ
            searchProducts();
        }
    });
    
    // Gắn sự kiện cho nút thêm sản phẩm
    addProductBtn.addEventListener('click', toggleAddProductForm);
    
    // Gắn sự kiện cho form thêm sản phẩm
    addProductForm.addEventListener('submit', addNewProduct);
    
    // Chức năng reset tìm kiếm khi xóa hết nội dung ô input
    searchInput.addEventListener('input', function() {
        if (searchInput.value.trim() === '') {
            // Hiển thị lại tất cả sản phẩm
            const productItems = document.querySelectorAll('.product-item');
            productItems.forEach(function(product) {
                product.style.display = 'flex';
            });
        }
    });
    
    // Thêm hiệu ứng hover cho các sản phẩm mới được thêm
    function addHoverEffectToNewProducts() {
        const productItems = document.querySelectorAll('.product-item');
        productItems.forEach(function(product) {
            product.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.02)';
                this.style.borderColor = '#58a6ff';
                this.style.boxShadow = '0 8px 20px rgba(88, 166, 255, 0.2)';
            });
            
            product.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.borderColor = '#30363d';
                this.style.boxShadow = 'none';
            });
        });
    }
    
    // Gọi hàm thêm hiệu ứng hover
    addHoverEffectToNewProducts();
    
    console.log('JavaScript đã được tải thành công!');
});
