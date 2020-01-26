const $siteList = $('.siteList')
const $lastLi = $siteList.find('li.last')
const storage = localStorage.getItem('storage')
const storageObject = JSON.parse(storage)
const $input = $('input')
const $choiceBtn = $('.choiceBtn')
const $bigBox = $('.bigBox')
const $smallBox = $(".smallBox")
const $form = $('.searchForm')
const $globalMain = $('.globalMain')
const body = document.getElementsByTagName('body')[0]
console.log(body);


const hashMap = storageObject || [
    { logo: 'a', url: "https://www.acfun.cn" },
    { logo: 'b', url: "https://www.baidu.com" }
]

const simplifyUrl = (url) => {
    return url.replace("https://", "").replace("http://", "")
        .replace("www.", "")
        .replace(/\/.*/, '') // 删除 / 后面的内容
}


const render = () => {
    $siteList.find('li:not(.last)').remove()
    hashMap.forEach((node, index) => {
        const $li = $(`
        <li> 
            <div class="close">
                <svg class="icon">
                    <use xlink:href="#icon-close"></use>
                </svg>
            </div>              
                <a href= "${node.url}" >
                        <div class="site">
                            <div class="logo">${node.logo}</div>
                            <div class="link">${simplifyUrl(node.url)}</div>    
                        </div>
                </a>
        </li>`).insertBefore($lastLi)
        $li.on('click', '.close', (e) => {
            hashMap.splice(index, 1)
            render()
        })
    })
}

render()

$('.addButton')
    .on('click', () => {
        let url = prompt('请问你要添加我网址是啥')
        console.log(url)
        if (url === '') {
            alert("请输入正确的网站")
            return null
        } else if (url.indexOf('http://') === -1 && url.indexOf('https://') === -1) {
            url = 'https://' + url
        }

        console.log(url)
        hashMap.push({ logo: simplifyUrl(url)[0], url: url })
        render()
    })

window.onbeforeunload = () => {
    const string = JSON.stringify(hashMap)
    localStorage.setItem('storage', string)
}

$(document).on('keypress', (e)=>{
    const {key} = e
    console.log(key);
    hashMap.forEach(node => {
        if(node.logo === key){
            window.open(node.url)
        }
    })
})

// 阻止input框的冒泡
$input.on('keypress' ,(e) => {
    e.stopPropagation()
})

// 切换搜索引擎
$(document).ready( () => {
    let searchTypes = [
        { name: 'wd', action: 'https://www.baidu.com/s', img:'baidu.705500cf.png', type: 'baidu'},
        { name: 'q', action: 'https://www.google.com/search', img: 'google.953ec577.png', type: 'google' },
        { name: 'q', action: 'https://cn.bing.com/search', img: 'bing.4d496f25.png', type: 'bing' },
        { name: 'query', action: 'https://www.sogou.com/web', img: 'sougou.698e3fe0.png', type: 'sougou'}
    ]
// 点击切换出现隐藏框
    $choiceBtn.on('click', () => {
        $bigBox.css({ "display": "block", height: 0 })
        $bigBox.animate({
            height: ($smallBox.height()) * $smallBox.length,
        }, 300)
    })
// 箭头函数没this，被坑了好久
    $smallBox.click(function fn() {
        $form.attr("action", searchTypes[$(this).index()].action)
        $input.attr('name', searchTypes[$(this).index()].name)
        $choiceBtn.find('img').attr('src', searchTypes[$(this).index()].img)
        $bigBox.animate({
            height: 0,
        }, 300, () => {
            $bigBox.css({ "display": "none", height: 0 });
        })
    })
})

$bigBox.mouseleave(function () {
    $bigBox.animate({
        height: 0,
    }, 300, function () {
        $bigBox.css({ "display": "none", height: 0 });
    })
})

// siteList 下划隐藏

function onMouseWheel(e) {/*当鼠标滚轮事件发生时，执行一些操作*/
    let down = true // 定义一个标志，当滚轮向下滚时，执行一些操作
    down = e.wheelDelta ? e.wheelDelta < 0 : e.detail > 0;
    if (down) {
        $globalMain.removeClass('in').addClass('out')
    } else {
        $globalMain.removeClass('out').addClass('in')
    }
    if (e.preventDefault) {/*FF 和 Chrome*/
        e.preventDefault();// 阻止默认事件
    }
    return false;
}
addEvent(body, 'mousewheel', onMouseWheel);
addEvent(body, 'DOMMouseScroll', onMouseWheel);
function addEvent(obj, xEvent, fn) {
    if (obj.attachEvent) {
        obj.attachEvent('on' + xEvent, fn);
    } else {
        obj.addEventListener(xEvent, fn, { passive: false });
    }
}
