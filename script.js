
//MENU HAMBURGER
const openButton=document.querySelector(".hamburger");

//console.log(openButton);

const modal = document.querySelector(".fullscreen-menu");

//console.log(modal);
openButton.addEventListener('click', ()=>{

  modal.classList.add('fullscreen-menu_active');
});

const closed= document.getElementById('fullscreen-menu_close');
//console.log(closed);


closed.addEventListener('click', (e)=>{
  e.preventDefault();
  //const modal = document.getElementById('fullscreen');

  //console.log(modal);

  modal.classList.remove('fullscreen-menu_active');
});

///////////////////SLIDER

const leftBtn = document.querySelector(".slider__btn--prev");
const rightBtn = document.querySelector(".slider__btn--next");
const items = document.querySelector(".slider__list");
const slider = document.querySelector(".slider");
const sliderItemArray=document.querySelectorAll(".slider__item")

const sliderStyles=getComputedStyle(slider);

sliderNumber=sliderItemArray.length;

console.log(sliderNumber);

const computedStyles=getComputedStyle(items);



rightBtn.addEventListener("click", function(e) {
  e.preventDefault();

  let currentWidth=parseInt(computedStyles.width);
  let currentRight=parseInt(computedStyles.right);

 
  if(currentRight<(currentWidth*(sliderNumber-1))){
  
items.style.right=`${currentRight+currentWidth}px`;
  }
  
});


leftBtn.addEventListener("click", function(e) {
  e.preventDefault();
  
  let currentWidth=parseInt(computedStyles.width);
  let currentRight=parseInt(computedStyles.right);

  if(currentRight>0) {
  
items.style.right=`${currentRight-currentWidth}px`;
  }

});
///////SLIDESHOW
const findBlockByAlias=(alias)=>{
 return $(".reviews__item").filter((ndx,item)=>{
    return $(item).attr("data-linked-with")==alias;
   
   
  })
}
$(".interactive-avatar__link").on('click', function(e){
  e.preventDefault();
  const $this=$(e.currentTarget);
  const target=$this.attr("date-open");
  const itemToShow=findBlockByAlias(target);
  const curItem=$this.closest(".reviews__switcher-item");

  itemToShow.addClass("active").siblings().removeClass("active");
  curItem.addClass("interactive-avatar--active").siblings().removeClass("interactive-avatar--active");
})

////////ACCORDION
const openItem=(item)=>{
const container=item.closest((".team__item"));
const contentBlock=container.find(".team__content");
const textBlock=contentBlock.find(".team__content-block");
const reqHeight=textBlock.height();
container.addClass("active");
contentBlock.height(reqHeight);



//triangle.addClass('team__title2')
}

const closeEveryItem=(container)=>{
  const items=container.find('.team__content');
  const itemContainer=container.find(".team__item");

  //console.log(itemContainer);
  itemContainer.removeClass("active");
  items.height(0);

  //const triangle=$('.team__title');
  //triangle.removeClass('team__title2')
}

const  triangle=(tr)=>{
  tr.addClass('team__title2')
}

const  triangle_rotate=(tr)=>{
  tr.removeClass('team__title2')
}

$('.team__title').click(e=>{
  const $this=$(e.currentTarget);
  const container=$this.closest('.team');

  const elemContainer=$this.closest('.team__item');
  
const tr=$this;



  if(elemContainer.hasClass("active")){
    closeEveryItem(container);
    triangle_rotate(tr);

  }else{
    closeEveryItem(container);
    openItem($this);
    triangle(tr);
  }
})

//MODAL

const validateFields=(form,fieldsArray)=>{

  fieldsArray.forEach(field=>{
    field.removeClass("input-error")
  if(field.val().trim()===''){
    field.addClass('input-error');//trim обрезает пробелы
  }
  
  });
  
  const errorFields=form.find(".input-error");
  return errorFields.length==0;

}

$('.form').submit(e=>{
  e.preventDefault();

  const form=$(e.currentTarget);
  const name=form.find("[name='name']");
  const phone=form.find("[name='phone']");
  const comment=form.find("[name='comment']");
  const to=form.find("[name='to']");

  const modal=$("#modal");
  const content=modal.find(".modal__content");

  modal.removeClass("error-modal");

  const isValid=validateFields(form,[name,phone,comment,to]);


if(isValid){
  $.ajax({

    url:"https://webdev-api.loftschool.com/sendmail",
    method:"POST",
    data:{
      name:name.val(),
      phone:phone.val(),
      comment:comment.val(),
      to:to.val()

    },

    success:(data)=>{

      content.text(data.message)
      //console.log(data);
      
  $.fancybox.open({
    src:'#modal',
    type:"inline"
  })
    },
    error:(data)=>{
      const message=data.responseJSON.message;
      content.text(message);
      console.log(data);
      modal.addClass('error-modal');

      $.fancybox.open({
        src:'#modal',
        type:"inline"
      })
    }
  });
}

})
$(".app-submit-btn").click(e=>{
  e.preventDefault();
  $.fancybox.close();
})

/////PLAYER
let player;
const playerContainer=$('.player');


let eventsInit=()=>{
  $('.player__splash').click(e=>{
    
    $('.player__splash').css({
      'display':'none'}
     );
     playerContainer.removeClass('active');
  playerContainer.addClass('paused');
  player.playVideo();
  })

$('.player__start').click(e=>{
e.preventDefault();

$('.player__splash').css({
 'display':'none'}
);

const btn=$(e.currentTarget);

if(playerContainer.hasClass('paused')){
  playerContainer.removeClass('paused');
  playerContainer.addClass('active');
  player.pauseVideo()
}else{
  playerContainer.addClass('paused')
  playerContainer.removeClass('active');
player.playVideo()
}

});


 


$('.player__playback').click(e=>{
  const bar=$(e.currentTarget);
  const clickPosition=e.originalEvent.layerX;

  const newButtonPositionPercent=(clickPosition/bar.width())*100;
  const newPlaybackPositionSec=(player.getDuration()/100)*newButtonPositionPercent;


  $('.player__playback-button').css({
    left:`${newButtonPositionPercent}%`
  })
  console.log(bar.width());
  player.seekTo(newPlaybackPositionSec);

})

};



const formatTime=timeSec=>{
  const roundTime=Math.round(timeSec);
  const minutes=addZero(Math.floor(roundTime/60));
  const seconds=addZero(roundTime-minutes*60);

function addZero(num){
  return num<10 ? `0${num}` :num
}

  return `${minutes}:${seconds}`
}

const onPlayerReady =()=>{

let interval;



 const durationSec=player.getDuration();
 $('.player__duration-estimate').text(formatTime(durationSec));

if (typeof interval !=='undefined'){
  clearInterval(interval);
}
interval=setInterval(()=>{
const completedSec=player.getCurrentTime();

const completedPercent=(completedSec/durationSec )*100;
$('.player__playback-button').css({
  left:`${completedPercent}%`
})

$('.player__duration-completed').text(formatTime(completedSec));
},1000)

}


function onYouTubeIframeAPIReady() {
  player = new YT.Player('yt-player', {
    height: '370',
    width: '660',
    videoId: 'LXb3EKWsInQ', 
    events: {
      'onReady': onPlayerReady,
     // 'onStateChange': onPlayerStateChange
    },
    playerVars: {
      controls: 0,
      disablekb: 1,
      showinfo: 0,
      rel: 0,
      autoplay: 0,
      modestbranding: 0
    }
  });
}
eventsInit();

////MAP
let myMap;

const init=()=>{
  myMap=new ymaps.Map('map',{
    center: [59.93916998692174, 30.309015096732622],
    zoom: 11,
    controls: []
  })

const coords=[
  [59.94554327989287, 30.38935262114668],
     [59.91142323563909, 30.50024587065841],
     [59.88693161784606, 30.319658102103713],
     [59.97033574821672, 30.315194906302924],
];
const myCollection = new ymaps.GeoObjectCollection({}, {
  draggable:false,
  iconLayout: 'default#image',
  iconImageHref: './css/img/decor/marker.svg',
  iconImageSize: [46, 57],
  iconImageOffset: [-35, -52]
});

for (let i = 0; i < coords.length; i++) {
  myCollection.add(new ymaps.Placemark(coords[i]));
}

myMap.geoObjects.add(myCollection);

myMap.behaviors.disable('scrollZoom');

};

ymaps.ready(init);


/////ACCORDION VERTICAL
const mesureWidth=(item)=>{
  let reqItemWidth=0;
  const screenWidth=$(window).width();
  const container=item.closest('.products-menu');
  const titlesBlocks=container.find(".products-menu__title");
  const titlesWidth=titlesBlocks.width()*titlesBlocks.length;

  const textContainer=item.find(".products-menu__container");
  const paddingLeft=parseInt(textContainer.css("padding-left"));
  const paddingRight=parseInt(textContainer.css("padding-right"));
 
  const isMobile=window.matchMedia("(max-width:768px)").matches;
 // console.log(isMobile);
 if(isMobile){
  reqItemWidth=screenWidth-titlesWidth;
  
 }else{
  reqItemWidth=500;
 }
 console.log(reqItemWidth);
 return{
   container:reqItemWidth,
   textContainer:reqItemWidth-paddingRight-paddingLeft
 }
 
 
}

const closeEveryItemInContainer=container=>{
  const items=container.find('.products-menu__item');
  
  const content=container.find('.products-menu__content');
  

  items.removeClass("activeAccord")
  content.width(0);
}



const openItemAccord=item=>{
 const hiddenConent=item.find('.products-menu__content');
 const reqWidth=mesureWidth(item);
 const textBlock=item.find(".products-menu__container");

item.addClass('activeAccord');
 hiddenConent.width(reqWidth.container);
 textBlock.width(reqWidth.textContainer);

}
$('.products-menu__title').on('click',e=>{
  e.preventDefault();
  const $this=$(e.currentTarget);
  const item=$this.closest('.products-menu__item');
  const itemOpened=item.hasClass("activeAccord");
  const container=$this.closest(".products-menu")

  if(itemOpened){
   closeEveryItemInContainer(container)
  }else{   
    closeEveryItemInContainer(container)
    openItemAccord(item);
  }
})

$(".products-menu__close").on("click",e=>{
e.preventDefault();
closeEveryItemInContainer($('.products-menu'));

})


////OPS
const sections=$("section");
const display=$(".maincontent");
const sideMenu=$(".fixed-menu");
const menuItems=sideMenu.find(".fixed-menu__item");

const mobileDetect=new MobileDetect(window.navigator.userAgent);
const isMobileVers=mobileDetect.mobile();


let inScroll=false;
sections.first().addClass("activeSection");

const countSectionPosition=sectionEq=>{
  const position=sectionEq*-100;
  if(isNaN(position)){
    console.error("передано не верное значение в countSectionPosition")
    return 0;
  }
  return position;
}

const changeMenuThemeForSection=sectionEq=>{
  const currentSection=sections.eq(sectionEq);
  const menuTheme=currentSection.attr("data-sidemenu-theme");
  const activeClassMenu="fixed-menu-shadowed";
  const activeClassLink="fixed-menu__link-shadow";
 
  const sideLink=$(".fixed-menu__link");
  if(menuTheme=="black"){
  sideMenu.addClass(activeClassMenu);
  sideLink.addClass(activeClassLink);
  }else{
    sideMenu.removeClass(activeClassMenu);
    sideLink.removeClass(activeClassLink);
  }
}

const resetActiveClassForItem=(items,itemEq,activeClass)=>{
  items.eq(itemEq).addClass(activeClass).siblings().removeClass(activeClass);
}



const performTransition=sectionEq=>{
  if(inScroll) return;

  const transitionOver=800;
  const mouseInertiaOver=300;
    inScroll=true;

    const position=countSectionPosition(sectionEq);

    changeMenuThemeForSection(sectionEq);
   
    display.css({
      transform:`translateY(${position}%)`
    });
  
    resetActiveClassForItem(sections,sectionEq,"activeSection");
    

    

setTimeout(()=>{
inScroll=false;
resetActiveClassForItem(menuItems,sectionEq,"fixed-menu__item--active");
},transitionOver+mouseInertiaOver);


};

const viewportScroller=()=>{

  const activeSection=sections.filter(".activeSection");
  const nextSection=activeSection.next();
  const prevSection=activeSection.prev();

  return {next(){
    if(nextSection.length){
      performTransition(nextSection.index());
    }},
    prev(){
      if(prevSection.length){
      performTransition(prevSection.index());
    }}
  }

  
  
}

$(window).on("wheel",e=>{
  const deltaY=e.originalEvent.deltaY;
 const scroller=viewportScroller();

  if(deltaY>0){
    scroller.next();
    
  }
  if(deltaY<0){
    scroller.prev();
  }

});

$(window).on("keydown",e=>{

  const tagName=e.target.tagName.toLowerCase();
 const userTypingInInput=tagName=='input' || tagName=='textarea';
 const scroller=viewportScroller();

  if(userTypingInInput) return ;
    switch(e.keyCode){
      case 38:
      scroller.prev();
      break;
      case 40:
      scroller.next();
      break;
      
    }
});

$(".wrapper").on("touchmover",e=>e.preventDefault());

$("[data-scroll-to]").click(e=>{
  e.preventDefault();

  const $this=$(e.currentTarget);
  const target=$this.attr("data-scroll-to");
  const reqSection=$(`[data-section-id=${target}]`);
 // console.log(reqSection.index())

 performTransition(reqSection.index());
})



console.log(isMobileVers);

if(isMobileVers){
  ///swipe  https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
  $("body").swipe({
    //Generic swipe handler for all directions
    swipe:function(event,direction, ) {
         const scroller=viewportScroller();
         let scrollDirection="";

         if(direction=="up") scrollDirection="next";
         if(direction=="down") scrollDirection="prev";

      scroller[scrollDirection]();
     
    }
  });
}



  
