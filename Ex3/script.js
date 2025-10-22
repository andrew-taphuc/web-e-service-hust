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
    addProductForm.addEventListener('submit', function(event) {
        event.preventDefault();
        console.log('Đã ấn Submit');
    });
    
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
    console.log('Load thành công file JS.');
});
