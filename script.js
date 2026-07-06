/* ===========================
   基本設定
=========================== */

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

html{
    scroll-behavior:smooth;
}

body{
    font-family:"Noto Sans TC","Microsoft JhengHei",sans-serif;
    background:#f8f8f8;
    color:#333;
    line-height:1.9;
}

/* ===========================
   Header
=========================== */

.site-header{
    background:#ffffff;
    position:sticky;
    top:0;
    z-index:999;
    box-shadow:0 2px 10px rgba(0,0,0,.08);
}

.header-inner{

    max-width:1200px;

    margin:auto;

    display:flex;

    justify-content:space-between;

    align-items:center;

    padding:18px 25px;

}

.logo{

    font-size:26px;

    font-weight:bold;

    color:#D4001A;

}

.nav{

    display:flex;

    gap:35px;

}

.nav a{

    text-decoration:none;

    color:#444;

    font-weight:500;

    transition:.3s;

}

.nav a:hover{

    color:#D4001A;

}

/* ===========================
Breadcrumb
=========================== */

.breadcrumb{

    max-width:1100px;

    margin:35px auto;

    padding:0 20px;

    font-size:14px;

    color:#888;

}

.breadcrumb a{

    text-decoration:none;

    color:#888;

}

.breadcrumb span{

    margin:0 6px;

}

/* ===========================
文章
=========================== */

.article-container{

    max-width:1100px;

    margin:auto;

    padding:0 20px 80px;

}

.article{

    background:white;

    border-radius:20px;

    padding:60px;

    box-shadow:0 8px 30px rgba(0,0,0,.08);

}

.category{

    display:inline-block;

    background:#D4001A;

    color:white;

    padding:8px 20px;

    border-radius:30px;

    font-size:14px;

    margin-bottom:20px;

}

.article h1{

    font-size:42px;

    line-height:1.4;

    margin-bottom:15px;

}

.date{

    color:#999;

    margin-bottom:35px;

}

.cover-image{

    width:100%;

    border-radius:18px;

    margin-bottom:45px;

}

/* ===========================
Section
=========================== */

section{

    margin-bottom:55px;

}

.article h2{

    font-size:30px;

    margin-bottom:20px;

    color:#D4001A;

    border-left:8px solid #D4001A;

    padding-left:15px;

}

.article p{

    font-size:18px;

    margin-bottom:18px;

}

.article ul{

    margin-left:25px;

    margin-bottom:20px;

}

.article li{

    margin-bottom:12px;

    font-size:18px;

}

/* ===========================
圖片
=========================== */

.article-image{

    width:100%;

    margin-top:25px;

    border-radius:15px;

    cursor:pointer;

    transition:.3s;

}

.article-image:hover{

    transform:scale(1.02);

}

/* ===========================
圖片說明
=========================== */

figure{

    margin-top:30px;

}

figcaption{

    text-align:center;

    color:#777;

    margin-top:10px;

    font-size:15px;

}

/* ===========================
FAQ
=========================== */

.faq-item{

    margin-bottom:20px;

    border:1px solid #ddd;

    border-radius:10px;

    overflow:hidden;

}

.faq-question{

    width:100%;

    padding:18px;

    border:none;

    background:#fafafa;

    text-align:left;

    cursor:pointer;

    font-size:17px;

    font-weight:bold;

}

.faq-question:hover{

    background:#f2f2f2;

}

.faq-answer{

    display:none;

    padding:20px;

    background:white;

}

/* ===========================
提醒區
=========================== */

.insurance-box{

    background:#FFF8E8;

    border-radius:18px;

    padding:40px;

}

/* ===========================
按鈕
=========================== */

.cta-button{

    display:inline-block;

    margin-top:25px;

    background:#D4001A;

    color:white;

    padding:15px 35px;

    border-radius:50px;

    text-decoration:none;

    transition:.3s;

}

.cta-button:hover{

    background:#B00016;

}

/* ===========================
備註
=========================== */

.note{

    color:#666;

    font-size:14px;

}

/* ===========================
Footer
=========================== */

.site-footer{

    background:white;

    padding:40px;

    text-align:center;

    color:#888;

    margin-top:50px;

}

/* ===========================
回到頂端
=========================== */

.top-button{

    position:fixed;

    right:25px;

    bottom:25px;

    width:55px;

    height:55px;

    border:none;

    border-radius:50%;

    background:#D4001A;

    color:white;

    font-size:15px;

    cursor:pointer;

    display:none;

    box-shadow:0 5px 20px rgba(0,0,0,.2);

}

.top-button.show{

    display:block;

}

/* ===========================
閱讀進度條
=========================== */

.progress-bar{

    position:fixed;

    top:0;

    left:0;

    height:5px;

    width:0;

    background:#D4001A;

    z-index:10000;

}

/* ===========================
圖片放大
=========================== */

.image-overlay{

    position:fixed;

    inset:0;

    background:rgba(0,0,0,.85);

    display:flex;

    justify-content:center;

    align-items:center;

    z-index:9999;

}

.image-overlay img{

    max-width:90%;

    max-height:90%;

    border-radius:15px;

}

/* ===========================
RWD
=========================== */

@media(max-width:768px){

.header-inner{

flex-direction:column;

gap:15px;

}

.nav{

gap:20px;

}

.article{

padding:30px;

}

.article h1{

font-size:30px;

}

.article h2{

font-size:24px;

}

.article p,.article li{

font-size:16px;

}

}
