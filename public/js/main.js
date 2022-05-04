const confirmDeletion = document.querySelectorAll('a.confirmDeletion');
confirmDeletion.forEach(confirmDelection => confirmDelection.addEventListener('click',e=>{

    if(!confirm('Confirm deletion')) {
        e.preventDefault();
        // return false;
    }
}))

//  用户端主页导航栏点亮，添加active 类名

const aLists = document.querySelectorAll('.a-list');
let url =  window.location.href.replace('http://localhost:3000/','');

if(url==='') url='home'
if(url.includes('all-products/')) url = url.replace('all-products/','')

console.log(url)
// / home
// /name name
// /all-products/name name
aLists.forEach(list=>{
  
  // console.log(list.textContent)
  if(list.textContent===url){
    list.classList.add('active-style')
  }else if(list.textContent==='All products' && url==='all-products'){
    list.classList.add('active-style')
  }
  // if(){

  // }
  // console.log(nav.textContent)
  // if(nav.textContent===url)
}
  )

// 图片预览
// View an image.
const galleryNode = document.querySelector('.pro-detail .gallery');
if(galleryNode){
  const gallery = new Viewer(galleryNode, {
    url(image) {
        // /product_images/<%= product.id %>/gallery/thumbs/<%= image %>
        return image.src.replace('/thumbs', '');
      },
    viewed() {
        gallery.zoomTo(1);
    },
  });
}




 
