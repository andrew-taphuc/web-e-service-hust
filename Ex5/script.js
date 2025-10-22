// Đợi DOM load xong trước khi thực thi JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Lấy các phần tử DOM
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const addProductBtn = document.getElementById('addProductBtn');
    const addProductSection = document.getElementById('addProductSection');
    const addProductForm = document.getElementById('addProductForm');
    const productsGrid = document.querySelector('.products-grid');
    
    // Mảng để lưu trữ danh sách sản phẩm
    let products = [];
    
    // Sản phẩm mẫu ban đầu
    const defaultProducts = [
        {
            name: "Fujifilm X100V",
            image: "https://cdn.vjshop.vn/may-anh/compact/fujifilm/fujifilm-x100v-black/fujifilm-x100v-black-500x500.jpg",
            description: "Máy ảnh compact cao cấp với cảm biến APS-C X-Trans CMOS 4, mang lại chất lượng ảnh tuyệt vời và thiết kế cổ điển tinh tế.",
            price: "32.500.000₫"
        },
        {
            name: "Canon AE-1",
            image: "https://cdn.assets.lomography.com/f0/1537ca53a6d7bbb99d637dde9994e5f03a9d68/1200x921x2.jpg?auth=6dc8bfe48bec9b02dc534cccd97aea03df34bdf1",
            description: "Máy ảnh film 35mm huyền thoại dành cho người yêu phong cách hoài cổ, dễ sử dụng và mang lại màu sắc film chân thực, sống động.",
            price: "5.200.000₫"
        },
        {
            name: "Kodak Gold 200",
            image: "https://product.hstatic.net/200000664119/product/kodak_gold_hop_nhua_0741bbf198b943279bf5735734ab8443.jpg",
            description: "Cuộn film màu 35mm phổ biến với tông vàng ấm áp đặc trưng, lý tưởng cho chụp chân dung, du lịch và phong cảnh.",
            price: "250.000₫"
        }
    ];
    
    // Hàm format giá tiền
    function formatPrice(price) {
        // Loại bỏ tất cả ký tự không phải số
        const numericPrice = price.replace(/[^\d]/g, '');
        
        // Chuyển đổi thành số
        const number = parseInt(numericPrice);
        
        // Format với dấu chấm phân cách hàng nghìn và thêm ký hiệu ₫
        return number.toLocaleString('vi-VN') + '₫';
    }
    
    // Hàm lưu sản phẩm vào localStorage
    function saveProductsToLocalStorage() {
        localStorage.setItem('products', JSON.stringify(products));
    }
    
    // Hàm load sản phẩm từ localStorage
    function loadProductsFromLocalStorage() {
        const savedProducts = localStorage.getItem('products');
        if (savedProducts) {
            products = JSON.parse(savedProducts);
        } else {
            // Chỉ dùng defaultProducts khi chưa có dữ liệu
            products = [...defaultProducts];
            saveProductsToLocalStorage();
        }
    }
    
    // Hàm render sản phẩm từ mảng
    function renderProducts() {
        productsGrid.innerHTML = '';
        products.forEach(function(product) {
            const productElement = document.createElement('article');
            productElement.className = 'product-item';
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}" width="150" height="150">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p><strong>Giá: ${formatPrice(product.price)}</strong></p>
            `;
            productsGrid.appendChild(productElement);
        });
    }
    
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
            // Thêm màu nền để form dễ nhận biết
            addProductSection.style.backgroundColor = '#1a1a2e';
            addProductSection.style.border = '2px solid #58a6ff';
        } else {
            addProductSection.classList.add('hidden');
            addProductBtn.textContent = 'Thêm sản phẩm';
            // Reset form khi đóng
            addProductForm.reset();
            // Xóa màu nền khi đóng form
            addProductSection.style.backgroundColor = '';
            addProductSection.style.border = '';
        }
    }
    
    // Chức năng thêm sản phẩm mới
    function addNewProduct(event) {
        event.preventDefault();
        
        const productName = document.getElementById('productName').value;
        const productImage = document.getElementById('productImage').value;
        const productDescription = document.getElementById('productDescription').value;
        const productPrice = document.getElementById('productPrice').value;
        
        // Tạo đối tượng sản phẩm mới
        const newProduct = {
            name: productName,
            image: productImage,
            description: productDescription,
            price: formatPrice(productPrice)
        };
        
        // Thêm sản phẩm vào mảng
        products.push(newProduct);
        
        // Lưu vào localStorage
        saveProductsToLocalStorage();
        
        // Render lại danh sách sản phẩm
        renderProducts();
        
        // Reset form và ẩn form
        addProductForm.reset();
        addProductSection.classList.add('hidden');
        addProductBtn.textContent = 'Thêm sản phẩm';
        
        console.log('Sản phẩm đã được thêm thành công!');

        // Hiển thị thông báo thành công
        showSuccessMessage('Sản phẩm đã được thêm thành công!');
    }
    
    // Hiển thị thông báo thành công
    function showSuccessMessage(message) {
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.textContent = message;
        
        document.body.appendChild(successMsg);
        
        // Tự động xóa sau 3 giây
        setTimeout(() => {
            successMsg.remove();
        }, 3000);
    }
    
    // Gắn sự kiện cho nút tìm kiếm
    searchBtn.addEventListener('click', searchProducts);
    
    //Cải thiện UX bằng cách ấn enter để tìm mà không cần chuột
    searchInput.addEventListener('keyup', function(event) {
        // Chỉ tìm kiếm khi nhấn Enter
        if (event.key === 'Enter' || event.keyCode === 13) {
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
    
    // Khởi tạo trang web
    function initializePage() {
        // Load sản phẩm từ localStorage
        loadProductsFromLocalStorage();
        
        // Render sản phẩm
        renderProducts();
        
        console.log('Trang web đã được khởi tạo với LocalStorage!');
    }
    
    // Khởi tạo trang web khi DOM đã load xong
    initializePage();
    
    console.log('Hoàn tất tải file JS!');
});
