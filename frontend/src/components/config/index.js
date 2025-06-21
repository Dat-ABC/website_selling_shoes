
export const registerFormControls = [
    {
        name: 'username',
        type: 'text',
        label: 'Tên đăng nhập',
        placeholder: 'Nhập tên đăng nhập',
        componentType: 'input',
    },
    {
        name: 'email',
        type: 'email',
        label: 'Email',
        placeholder: 'Nhập email',
        componentType: 'input',
    },
    {
        name: 'password',
        type: 'password',
        label: 'Mật khẩu',
        placeholder: 'Nhập mật khẩu',
        componentType: 'input',
    }
]

export const loginFormControls = [
    {
        name: 'email',
        type: 'email',
        label: 'Email',
        placeholder: 'Nhập email',
        componentType: 'input',
    },
    {
        name: 'password',
        type: 'password',
        label: 'Mật khẩu',
        placeholder: 'Nhập mật khẩu',
        componentType: 'input',
    }
]

export const addProductFormElements = [
    {
        label: "Tiêu đề",
        name: "title",
        componentType: "input",
        type: "text",
        placeholder: "Nhập vào tiêu đề",
    },
    {
        label: "Mô tả chi tiết",
        name: "description",
        componentType: "textarea",
        placeholder: "Nhập vào mô tả sản phẩm",
    },
    {
        label: "Loại",
        name: "category",
        componentType: "select",
        placeholder: 'Loại',
        options: [
            { id: "men", label: "Nam" },
            { id: "women", label: "Nữ" },
            { id: "kids", label: "Trẻ em" },
            { id: "accessories", label: "Phụ kiện" },
            { id: "footwear", label: "Giày dép" },
        ],
    },
    {
        label: "Thương hiệu",
        name: "brand",
        componentType: "select",
        placeholder: 'Thương hiệu',
        options: [
            { id: "nike", label: "Nike" },
            { id: "adidas", label: "Adidas" },
            { id: "puma", label: "Puma" },
            { id: "levi", label: "Levi's" },
            { id: "zara", label: "Zara" },
            { id: "h&m", label: "H&M" },
        ],
    },
    // {
    //     label: "Màu sắc",
    //     name: "colors",
    //     componentType: "multi-select",
    //     placeholder: "Chọn màu sắc",
    //     options: [
    //         { id: "red", label: "Đỏ" },
    //         { id: "blue", label: "Xanh dương" },
    //         { id: "green", label: "Xanh lá" },
    //         { id: "yellow", label: "Vàng" },
    //         { id: "black", label: "Đen" },
    //         { id: "white", label: "Trắng" },
    //         { id: "gray", label: "Xám" },
    //         { id: "brown", label: "Nâu" },
    //         { id: "pink", label: "Hồng" },
    //         { id: "purple", label: "Tím" },
    //         { id: "orange", label: "Cam" },
    //     ],
    // },
    // {
    //     label: "Kích thước",
    //     name: "sizes",
    //     componentType: "multi-select",
    //     placeholder: "Chọn kích thước",
    //     options: [
    //         { id: "xs", label: "XS" },
    //         { id: "s", label: "S" },
    //         { id: "m", label: "M" },
    //         { id: "l", label: "L" },
    //         { id: "xl", label: "XL" },
    //         { id: "xxl", label: "XXL" },
    //         { id: "28", label: "28" },
    //         { id: "30", label: "30" },
    //         { id: "32", label: "32" },
    //         { id: "34", label: "34" },
    //         { id: "36", label: "36" },
    //         { id: "38", label: "38" },
    //         { id: "40", label: "40" },
    //         { id: "42", label: "42" },
    //     ],
    // },
    {
        label: "Giá",
        name: "price",
        componentType: "input",
        type: "number",
        placeholder: "Nhập giá",
    },
    {
        label: "Giá bán",
        name: "salePrice",
        componentType: "input",
        type: "number",
        placeholder: "Nhập giá bán (tuỳ chọn)",
    },
    {
        label: "Tổng số hàng tồn kho",
        name: "totalStock",
        componentType: "input",
        type: "number",
        placeholder: "Nhập tổng số hàng tồn kho",
    },
    {
        label: "Biến thể (Màu – Size – Stock)",
        name: "variants",
        componentType: "variantListFree", // custom component bạn tự viết
        placeholder: "Thêm variant",
        // variantList sẽ render một bảng nhỏ:
        // mỗi dòng gồm select màu, select size, input stock
    },
];

// Thêm mapping cho màu sắc và kích thước để hiển thị
export const colorOptionsMap = {
    red: "Đỏ",
    blue: "Xanh dương",
    green: "Xanh lá",
    yellow: "Vàng",
    black: "Đen",
    white: "Trắng",
    gray: "Xám",
    brown: "Nâu",
    pink: "Hồng",
    purple: "Tím",
    orange: "Cam",
};

export const sizeOptionsMap = {
    xs: "XS",
    s: "S",
    m: "M",
    l: "L",
    xl: "XL",
    "2xl": "2XL",
    "3xl": "3XL",
    "4xl": "4XL",
    "5xl": "5XL",
    "27": "27",
    "28": "28",
    "29": "29",
    "30": "30",
    "31": "31",
    "32": "32",
    "33": "33",
    "34": "34",
    "35": "35",
    "36": "36",
    "37": "37",
    "38": "38",
    "39": "39",
    "40": "40",
    "41": "41",
    "42": "42",
    "43": "43",
    "44": "44",
    "45": "45"
};

export const shoppingViewHeaderMenuItems = [
    {
        id: "home",
        label: "Trang chủ",
        path: "/shop/home",
    },
    {
        id: "products",
        label: "Sản phẩm",
        path: "/shop/listing",
    },
    {
        id: "men",
        label: "Nam",
        path: "/shop/listing",
    },
    {
        id: "women",
        label: "Nữ",
        path: "/shop/listing",
    },
    {
        id: "kids",
        label: "Trẻ em",
        path: "/shop/listing",
    },
    {
        id: "footwear",
        label: "Giày dép",
        path: "/shop/listing",
    },
    {
        id: "accessories",
        label: "Phụ kiện",
        path: "/shop/listing",
    },
    {
        id: "search",
        label: "Tìm kiếm",
        path: "/shop/search",
    },
];

export const categoryOptionsMap = {
    men: "Nam",
    women: "Nữ",
    kids: "Trẻ em",
    accessories: "Phụ kiện",
    footwear: "Giày dép",
};

export const brandOptionsMap = {
    nike: "Nike",
    adidas: "Adidas",
    puma: "Puma",
    levi: "Levi",
    zara: "Zara",
    "h&m": "H&M",
};

export const filterOptions = {
    category: [
        { id: "men", label: "Nam" },
        { id: "women", label: "Nữ" },
        { id: "kids", label: "Trẻ em" },
        { id: "accessories", label: "Phụ kiện" },
        { id: "footwear", label: "Giày dép" },
    ],
    brand: [
        { id: "nike", label: "Nike" },
        { id: "adidas", label: "Adidas" },
        { id: "puma", label: "Puma" },
        { id: "levi", label: "Levi's" },
        { id: "zara", label: "Zara" },
        { id: "h&m", label: "H&M" },
    ],
};

export const sortOptions = [
    { id: "price-lowtohigh", label: "Giá: Thấp đến Cao" },
    { id: "price-hightolow", label: "Giá: Cao đến Thấp" },
    { id: "title-atoz", label: "Tiêu đề: A đến Z" },
    { id: "title-ztoa", label: "Tiêu đề: Z đến A" },
];

export const addressFormControls = [
    {
        label: "Địa chỉ",
        name: "address",
        componentType: "input",
        type: "text",
        placeholder: "Nhập địa chỉ...",
    },
    {
        label: "Tỉnh",
        name: "city",
        componentType: "input",
        type: "text",
        placeholder: "Nhập tỉnh...",
    },
    {
        label: "Mã",
        name: "pincode",
        componentType: "input",
        type: "text",
        placeholder: "Nhập mã...",
    },
    {
        label: "Điện thoại",
        name: "phone",
        componentType: "input",
        type: "text",
        placeholder: "Nhập số điện thoại",
    },
    {
        label: "Ghi chú",
        name: "notes",
        componentType: "textarea",
        placeholder: "Nhập vào ghi chú...",
    },
];