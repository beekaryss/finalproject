function loadFooter() {
    $(".footer").append('<a name="footercon"></a><div class="container"><div class="footer__inner">' +
        '<div class="footer__col footer__col--first"><div class="footer__logo">Porsche</div>' +
        '<div class="footer__text">The car dealership provides a full range of services for the sale of Porsche' +
        ' cars, original spare parts and accessories, as well as service and repair. You can choose your dream car' +
        ' from the Porsche lineup, go through a test drive, get a loan and insurance.</div>' +
        '<div class="footer__soc"><div class="footer__soc-header"><b>Follow us</b></div>' +
        '<div class="footer__soc-content"><a href="https://twitter.com/Porsche" target="black">' +
        '<img src="assets\\icons\\twetter.png"></a><a href="https://www.instagram.com/porsche/" target="black">' +
        '<img src="assets\\icons\\insta.png"></a><a href="https://www.facebook.com/groups/PorscheForumGlobal/" target="black">' +
        '<img src="assets\\icons\\facebook.png"></a><a href="https://vk.com/porschecom?from=quick_search" target="black">' +
        '<img src="assets\\icons\\vk.png"></a></div></div></div><div class="footer__col footer__col--second">' +
        '<div class="footer__title">Contacts</div><p>+77028214939</p><p>porsche_kazakhstan@gmail.com</p><p>porsche_almaty@gmail.com</p>' +
        '<p>Developers:</p><p>Kenzhebek Azamat</p><p>Ramatdinov Bauyrzhan</p></div><div class="footer__col footer__col--third">' +
        '<div class="footer__title">Location</div><div id="map"></div></div></div></div>')
}

function editStyleUp(a) {
    if(a == 1)
        $('#userProfileStatements').animate({marginTop: '0px'});
    else
        $('#userProfileStatements').animate({marginTop: '-565px'});
}

function getUserNameForProf() {
    let user = JSON.parse(localStorage.getItem('authUser') || "[]");
    $('#UserNameProfGetJs').remove();
    let s = "";
    if((user.firstName + " " + user.lastName).length > 20){
        if(user.firstName.length < 19) s = user.firstName + " " +
            user.lastName.substr(0, 1) + ".";
        else if(user.firstName.length > 19 && user.lastName.length < 19) s = user.lastName
            + " " + user.firstName.substr(0, 1) + ".";
        else if(user.firstName.length > 19 && user.lastName.length > 19) s = user.firstName.substr(0, 1)
            + ". " + user.lastName.substr(0, 1) + ".";
    }else s = user.firstName + " " + user.lastName;

    $('#UserNameDataProfile').append('<label id="UserNameProfGetJs">' + s + '</label>');
}

function scrollButId(a) {
    let sc = [0, 650, 2500, 1300];
    $('body,html').animate({
        scrollTop: sc[a]
    }, 700);
}

function saveCommentUser() {
    let authUser = JSON.parse(localStorage.getItem('authUser') || "[]");
    let s = $('#commentsAdminUserProf textarea').val() || "";
    if(s.length == 0) return;
    let Comments = JSON.parse(localStorage.getItem('CommentsUser') || "[]");
    Comments.push({user: authUser.eMail, comment: s});
    localStorage.setItem('CommentsUser', JSON.stringify(Comments));
    $('#commentsAdminUserProf textarea').val('')
    swal("GooD!", "Thanks for the feedback;))", "success");
}

function submitActionUserBuy(typeReq, carName) {
    let authUser = JSON.parse(localStorage.getItem('authUser') || "[]");
    if(authUser.length == 0){
        swal({
            title: "Oops!",
            text: "You are not authorized;)",
            icon: "warning",
        });
        return;
    }
    if(typeReq == 1) {
        swal("Are you sure?", {
            buttons: {
                Cancel: "Cancel",
                Yes: true
            }
        }).then((value) => {
            if(value == "Yes"){
                swal("Nice!", "Your purchase request has been sent!", "success");
                let Request = JSON.parse(localStorage.getItem('Request') || "[]");
                Request.push({user: authUser.eMail, type: "Buy", carName: carName, ans: ""});
                localStorage.setItem('Request', JSON.stringify(Request));
            }
        });
    }
    else{
        swal("Are you sure?", {
            buttons: {
                Cancel: "Cancel",
                Yes: true
            }
        }).then((value) => {
            if(value == "Yes"){
                swal("Nice!", "Your request for a test drive has been sent!", "success");
                let Request = JSON.parse(localStorage.getItem('Request') || "[]");
                Request.push({user: authUser.eMail, type: "Test Drive", carName: carName, ans: ""});
                localStorage.setItem('Request', JSON.stringify(Request));
            }
        });
    }
}

function loadRequests() {
    let authUser = JSON.parse(localStorage.getItem('authUser') || "[]");
    $('tr[id="trForRemoveRequestList"]').remove();
    let Request = JSON.parse(localStorage.getItem('Request') || "[]"), t = 1;
    for(let i of Request){
        if(i.user == authUser.eMail) {
            $('#tableForAllResultsProfile tbody').append('<tr id="trForRemoveRequestList"><td>' + t + '</td>' +
                '<td>' + i.type + '</td><td>' + i.carName + '</td><td><textarea cols="85" rows="3">' + i.ans + '</textarea>' +
                '<button onclick="deleteThisRequestUser(' + (t - 1) + ')">C</button></td></tr>');
            t++;
        }
    }
}
function deleteThisRequestUser(a) {
    swal("Do you want to cancel the request?", {
        buttons: {
            Cancel: "Cancel",
            Yes: true
        }
    }).then((value) => {
        if(value == "Yes"){
            swal("Nice!", "Your request was cancelled!", "success");
            let authUser = JSON.parse(localStorage.getItem('authUser') || "[]");
            let Request = JSON.parse(localStorage.getItem('Request') || "[]"), t = 0;
            for(let i = 0; i < Request.length; i++){
                if(Request[i].user == authUser.eMail) {
                    if(t == a){
                        Request.splice(i, 1);
                        localStorage.setItem('Request', JSON.stringify(Request));
                        break;
                    }
                    t++;
                }
            }
            loadRequests();
        }
    });
}

function checkUserDataLine() {
    let authUser = JSON.parse(localStorage.getItem('authUser') || "[]");
    if(authUser.length != 0){
        if(authUser.eMail == "porscheadmin@gmail.com"){
            $('#UserNameLogProf').append('<a class="nav__link" onclick="logOutUser()" style="margin-left: 5px">LogOut</a>' +
                '<a class="nav__link" href="assets/AdminPage/AdminPage.html">' + authUser.firstName + " " + authUser.lastName.substr(0, 1) + '.</a>');
        }
        else {
            $('#UserNameLogProf').append('<a class="nav__link" onclick="logOutUser()" style="margin-left: 5px">LogOut</a>' +
                '<a class="nav__link" href="User_Profile.html">' + authUser.firstName + " " + authUser.lastName.substr(0, 1) + '.</a>');
        }
    }
    else{
        $('#UserNameLogProf').append('<a class="nav__link" href="LogInPage.html" style="margin-left: 5px">Log In</a>');
    }
}

function logOutUser() {
    localStorage.setItem('authUser', JSON.stringify([]));
    window.location.replace("LogInPage.html");
}

//map by API
var myMap;
ymaps.ready(init); // Ожидание загрузки API с сервера Яндекса
function init () {
    myMap = new ymaps.Map("map", {
        center: [43.238293, 76.945465], // Координаты центра карты
        zoom: 12 // Zoom
    });
}
