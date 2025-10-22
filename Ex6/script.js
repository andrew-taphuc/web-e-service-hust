// Đợi DOM load xong trước khi thực thi JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Lấy các phần tử DOM
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const addProductBtn = document.getElementById('addProductBtn');
    const addProductSection = document.getElementById('addProductSection');
    const addProductForm = document.getElementById('addProductForm');
    const productsGrid = document.querySelector('.products-grid');
    
    // Mảng để lưu trữ danh sách sản phẩm (ta dùng global scope để có thể xóa được sản phẩm khi gọi button từ HTML với onclick)
    window.products = [];
    
    // Sản phẩm mẫu ban đầu
    const defaultProducts = [
        {
            name: "Fujifilm X100V",
            image: "https://cdn.vjshop.vn/may-anh/compact/fujifilm/fujifilm-x100v-black/fujifilm-x100v-black-500x500.jpg",
            description: "Máy ảnh compact cao cấp với cảm biến APS-C X-Trans CMOS 4, mang lại chất lượng ảnh tuyệt vời và thiết kế cổ điển tinh tế.",
            price: "32.500.000₫",
            category: "camera"
        },
        {
            name: "Canon AE-1",
            image: "https://cdn.assets.lomography.com/f0/1537ca53a6d7bbb99d637dde9994e5f03a9d68/1200x921x2.jpg?auth=6dc8bfe48bec9b02dc534cccd97aea03df34bdf1",
            description: "Máy ảnh film 35mm huyền thoại dành cho người yêu phong cách hoài cổ, dễ sử dụng và mang lại màu sắc film chân thực, sống động.",
            price: "5.200.000₫",
            category: "camera"
        },
        {
            name: "Kodak Gold 200",
            image: "https://product.hstatic.net/200000664119/product/kodak_gold_hop_nhua_0741bbf198b943279bf5735734ab8443.jpg",
            description: "Cuộn film màu 35mm phổ biến với tông vàng ấm áp đặc trưng, lý tưởng cho chụp chân dung, du lịch và phong cảnh.",
            price: "250.000₫",
            category: "film"
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
        localStorage.setItem('products', JSON.stringify(window.products));
    }
    
    // Hàm load sản phẩm từ localStorage hoặc Fetch API
    async function loadProductsFromLocalStorage() {
        const savedProducts = localStorage.getItem('products');
        if (savedProducts) {
            window.products = JSON.parse(savedProducts);
        } else {
            // Thử load từ file JSON bằng Fetch API
            try {
                const response = await fetch('./products.json');
                if (response.ok) {
                    const jsonProducts = await response.json();
                    window.products = [...jsonProducts];
                    console.log('Đã tải sản phẩm từ products.json bằng Fetch API');
                } else {
                    throw new Error('Không thể tải file JSON');
                }
            } catch (error) {
                console.log('Không thể tải từ JSON, sử dụng dữ liệu mặc định:', error);
                // Fallback về defaultProducts nếu không thể fetch
                window.products = [...defaultProducts];
            }
            saveProductsToLocalStorage();
        }
    }
    
    // Hàm render sản phẩm từ mảng
    function renderProducts() {
        renderFilteredProducts(window.products);
    }

    // Hàm xóa sản phẩm với xác nhận
    window.deleteProduct = function(productName) {
        if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${productName}"?`)) {
            window.products = window.products.filter(product => product.name !== productName);
            saveProductsToLocalStorage();
            renderProducts();
            showSuccessMessage(`Đã xóa sản phẩm "${productName}"`);
        }
    }

    // Hàm hiển thị chi tiết sản phẩm
    window.showProductDetail = function(productName) {
        const product = window.products.find(p => p.name === productName);
        if (product) {
            const modal = document.createElement('div');
            modal.className = 'product-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <div class="product-detail">
                        <img src="${product.image}" alt="${product.name}" class="detail-image">
                        <div class="detail-info">
                            <h2>${product.name}</h2>
                            <p class="detail-description">${product.description}</p>
                            <p class="detail-price"><strong>Giá: ${formatPrice(product.price)}</strong></p>
                            <p class="detail-category"><strong>Danh mục: ${getCategoryName(product.category)}</strong></p>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Đóng modal khi click vào X hoặc bên ngoài
            modal.querySelector('.close-modal').addEventListener('click', () => {
                modal.remove();
            });
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        }
    }

    // Hàm lấy tên danh mục
    function getCategoryName(category) {
        const categoryNames = {
            'camera': 'Máy ảnh',
            'lens': 'Ống kính',
            'film': 'Film',
            'accessory': 'Phụ kiện'
        };
        return categoryNames[category] || 'Không xác định';
    }
    
    // Hàm lấy giá trị số từ chuỗi giá
    function getNumericPrice(priceString) {
        return parseInt(priceString.replace(/[^\d]/g, ''));
    }

    // Hàm lọc sản phẩm theo nhiều tiêu chí
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const categoryFilter = document.getElementById('categoryFilter').value;
        const priceFilter = document.getElementById('priceFilter').value;
        const sortBy = document.getElementById('sortBy').value;
        
        let filteredProducts = window.products.filter(function(product) {
            // Lọc theo tên
            const matchesSearch = product.name.toLowerCase().includes(searchTerm);
            
            // Lọc theo danh mục
            const matchesCategory = !categoryFilter || product.category === categoryFilter;
            
            // Lọc theo giá
            let matchesPrice = true;
            if (priceFilter) {
                const [minPrice, maxPrice] = priceFilter.split('-').map(Number);
                const productPrice = getNumericPrice(product.price);
                matchesPrice = productPrice >= minPrice && productPrice <= maxPrice;
            }
            
            return matchesSearch && matchesCategory && matchesPrice;
        });
        
        // Sắp xếp sản phẩm
        if (sortBy) {
            filteredProducts = sortProducts(filteredProducts, sortBy);
        }
        
        // Render sản phẩm đã lọc
        renderFilteredProducts(filteredProducts);
    }

    // Hàm sắp xếp sản phẩm
    function sortProducts(productsArray, sortBy) {
        return productsArray.sort(function(a, b) {
            switch(sortBy) {
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'price-asc':
                    return getNumericPrice(a.price) - getNumericPrice(b.price);
                case 'price-desc':
                    return getNumericPrice(b.price) - getNumericPrice(a.price);
                default:
                    return 0;
            }
        });
    }

    // Hàm render sản phẩm đã lọc
    function renderFilteredProducts(filteredProducts) {
        productsGrid.innerHTML = '';
        filteredProducts.forEach(function(product) {
            const productElement = document.createElement('article');
            productElement.className = 'product-item';
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}" width="150" height="150">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p><strong>Giá: ${formatPrice(product.price)}</strong></p>
                <div class="product-actions">
                    <button class="view-detail-btn" onclick="showProductDetail('${product.name}')">Xem chi tiết</button>
                    <button class="delete-btn" onclick="deleteProduct('${product.name}')">Xóa</button>
                </div>
            `;
            productsGrid.appendChild(productElement);
        });
    }

    // Chức năng tìm kiếm sản phẩm (giữ nguyên để tương thích)
    function searchProducts() {
        filterProducts();
    }
    
    // Chức năng toggle form thêm sản phẩm với hiệu ứng transition
    function toggleAddProductForm() {
        if (addProductSection.classList.contains('hidden')) {
            // Mở form với hiệu ứng mượt mà
            addProductSection.classList.remove('hidden');
            addProductSection.classList.add('show');
            addProductBtn.textContent = 'Đóng form';
            // Thêm màu nền để form dễ nhận biết
            addProductSection.style.backgroundColor = '#1a1a2e';
            addProductSection.style.border = '2px solid #58a6ff';
        } else {
            // Đóng form với hiệu ứng mượt mà
            addProductSection.classList.remove('show');
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
        const productCategory = document.getElementById('productCategory').value;
        
        // Tạo đối tượng sản phẩm mới
        const newProduct = {
            name: productName,
            image: productImage,
            description: productDescription,
            price: formatPrice(productPrice),
            category: productCategory
        };
        
        // Thêm sản phẩm vào mảng
        window.products.push(newProduct);
        
        // Lưu vào localStorage
        saveProductsToLocalStorage();
        
        // Render lại danh sách sản phẩm
        renderProducts();
        
        // Reset form và ẩn form với hiệu ứng
        addProductForm.reset();
        addProductSection.classList.remove('show');
        addProductSection.classList.add('hidden');
        addProductBtn.textContent = 'Thêm sản phẩm';
        // Xóa màu nền khi đóng form
        addProductSection.style.backgroundColor = '';
        addProductSection.style.border = '';
        
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
    
    // Gắn sự kiện cho bộ lọc nâng cao
    document.getElementById('categoryFilter').addEventListener('change', filterProducts);
    document.getElementById('priceFilter').addEventListener('change', filterProducts);
    document.getElementById('sortBy').addEventListener('change', filterProducts);
    document.getElementById('clearFiltersBtn').addEventListener('click', clearFilters);
    
    // Chức năng reset tìm kiếm khi xóa hết nội dung ô input
    searchInput.addEventListener('input', function() {
        filterProducts();
    });

    // Hàm xóa tất cả bộ lọc
    function clearFilters() {
        searchInput.value = '';
        document.getElementById('categoryFilter').value = '';
        document.getElementById('priceFilter').value = '';
        document.getElementById('sortBy').value = '';
        renderProducts();
    }
    
    // Khởi tạo trang web
    async function initializePage() {
        // Load sản phẩm từ localStorage hoặc Fetch API
        await loadProductsFromLocalStorage();
        
        // Render sản phẩm
        renderProducts();
        
        console.log('Trang web đã được khởi tạo với LocalStorage và Fetch API!');
    }
    
    // Khởi tạo trang web khi DOM đã load xong
    initializePage();
    
    console.log('Hoàn tất tải file JS!');
});
