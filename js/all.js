const xhr = new XMLHttpRequest();
let travelData = [];
xhr.open('get','https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json',true);
xhr.send(null);
xhr.onload = function(){
  travelData = JSON.parse(xhr.responseText).result.records;
  pageInfo(1);
};

const area = document.getElementById('area');
const areaTitle = document.querySelector('.areaTitle');
const headPic = document.querySelector('.headPic');
const listContainer = document.querySelector('.listContainer');
const gotopButton = document.querySelector('.goTop');
const selectBtn = document.querySelector('.buttonArea');
const pageList = document.querySelector('.pageList');

//分頁資料判斷邏輯
function pageInfo(nowPage) {
  //陣列資料總數
  const dataTotal = travelData.length;
  //單頁顯示資料數量
  const perpageCount = 10;
  //針對資料總數所產生的總頁數
  const pageTotal = Math.ceil (dataTotal / perpageCount);
  //當下頁數
  let currentPage = nowPage;
  if (currentPage > pageTotal ) {
    currentPage === pageTotal;
  }
  //判斷該頁數的第一筆資料是取自陣列的第幾筆資料
  const minData = (currentPage*perpageCount) - perpageCount + 1;
  //判斷該頁數的最後一筆資料是取自陣列的第幾筆資料
  const maxData = (currentPage*perpageCount);
  //定義一個存取分頁資料的陣列
  let perpageData = [];

  //設定條件判斷將資料推入陣列
  for (let i=0; i<dataTotal; i++){
    //定義資料為迴圈當下的第幾筆，需從第一筆開始而非0
    const pageNum = i+1;
    if (pageNum >= minData && pageNum <= maxData){
      //符合數量規定才會將資料推入陣列
      perpageData.push(travelData[i]);
    }
  };
  //將分頁判斷資料組成物件並傳入對應function
  const pageInfo = {
    dataTotal,
    currentPage,
    perpageCount,
    pageTotal,
    hasPage: currentPage > 1,
    nextPage: currentPage < pageTotal
  };
  //將整理好的資料傳送到對應的funciton
  showallData(perpageData);
  showPage(pageInfo);
};

function showPage(pageInfo){
  let str = '';
  const page = pageInfo.pageTotal;
  if (pageInfo.hasPage){
    str += '<li class="preButton"><a href="" data-page="'+[Number(pageInfo.currentPage)-1]+'" >上一頁</a></li>'
  }else{
    str += '<li class="preButton disable"><a href="">上一頁</a></li>'
  };
  for (let i=1; i<=page; i++){
    if (i == pageInfo.currentPage){
      str += '<li class="pageItem"><a class="currentPage" href="" data-page="'+i+'">'+i+'</a></li>'
    }else{
      str += '<li class="pageItem"><a href="" data-page="'+i+'">'+i+'</a></li>'
    };
  };
  if (pageInfo.nextPage){
    str += '<li class="nextButton" ><a href="" data-page="'+[Number(pageInfo.currentPage)+1]+'">下一頁</a></li>'
  }else{
    str += '<li class="nextButton disable"><a href="">下一頁</a></li>'
  };
  pageList.innerHTML = str;
  console.log(pageInfo.currentPage);
};

function changePage(e){
  e.preventDefault();
  const nowPage = e.target.dataset.page;
  if (e.target.nodeName !== 'A'){return}else{
    pageInfo(nowPage);
  };
};


function showallData(perpageData){
  areaTitle.textContent = '所有景點資訊';
  let str = '';
  for (let i=0;i<perpageData.length;i++){
    str += '<div class="listItem"><div class="headPic" style="background-image: url('+perpageData[i].Picture1+');"><h3 class="headTitle">'+perpageData[i].Name+'</h3><p class="headArea">'+perpageData[i].Zone+'</p></div><div class="infoArea"><div class="infoBlock infoBlock1"><img src="pic/icons_clock.png" alt=""><span class="infoTime">'+perpageData[i].Opentime+'</span></div><div class="infoBlock infoBlock2"><img src="pic/icons_pin.png" alt=""><span class="infoAddr">'+perpageData[i].Add+'</span></div><div class="infoBlock infoBlock3"><img src="pic/icons_phone.png" alt=""><span class="infoTel">'+perpageData[i].Tel+'</span></div><div class="forFree"><img src="pic/icons_tag.png" alt=""><span>'+perpageData[i].Ticketinfo+'</span></div></div></div>'
  };
  listContainer.innerHTML = str;
};  

function updateList(e){
  gotopButton.style.display = "block";
  const selectValue = e.target.value;
  areaTitle.textContent = selectValue;
  let str = '';
  for (let i=0;i < travelData.length;i++){
    if (travelData[i].Zone === selectValue){
      str += '<div class="listItem"><div class="headPic" style="background-image: url('+travelData[i].Picture1+');"><h3 class="headTitle">'+travelData[i].Name+'</h3><p class="headArea">'+travelData[i].Zone+'</p></div><div class="infoArea"><div class="infoBlock infoBlock1"><img src="pic/icons_clock.png" alt=""><span class="infoTime">'+travelData[i].Opentime+'</span></div><div class="infoBlock infoBlock2"><img src="pic/icons_pin.png" alt=""><span class="infoAddr">'+travelData[i].Add+'</span></div><div class="infoBlock infoBlock3"><img src="pic/icons_phone.png" alt=""><span class="infoTel">'+travelData[i].Tel+'</span></div><div class="forFree"><img src="pic/icons_tag.png" alt=""><span>'+travelData[i].Ticketinfo+'</span></div></div></div>'
    };
  };
  pageList.classList.add('disable');
  listContainer.innerHTML = str;
  if (selectValue === "請選擇行政區"){
    areaTitle.textContent = '所有景點資訊';
    pageInfo(1);
    pageList.classList.remove('disable');
  };
}

function clickList(e){
  area.value = e.target.value;
  updateList(e);
}

pageList.addEventListener('click',changePage);
area.addEventListener('change',updateList);
selectBtn.addEventListener('click',clickList);
