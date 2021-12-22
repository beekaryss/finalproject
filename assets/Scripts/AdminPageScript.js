let setVisible = true;
var butttonCount = 1;
var DisableSortPosition = 1;
function Nav() {
    if (setVisible) {
        $('#visible').remove();
        $('#menu').append('<div id="visible"><h2 onclick="closeAllWindow()">Admin</h2>' +
            '<ul><li onclick="OpenRegForm()">Add user</li><li onclick="UpdateUserDataShowWindow()">Update user data</li>' +
            '<li onclick="UserListShow()">List all users</li><li onclick="ShowWindowForDeleteUser()">Delete user</li>' +
            '<li onclick="openWindowDisableEnable()">Disable/Enable</li><li onclick="createDivTableForCommentsAdmin()">Comment</li>' +
            '<li onclick="openRequestWindow()">Requests</li><li onclick="SiteSettingsShowWindow()">Site settings</li>' +
            '<li onclick="LogOut()">LogOut</li></ul><img src="../AdminPage/porscheNice.png"></div>');
        $(document).ready(function() {
            $('#main').animate({marginLeft: '250px'});
            $('#menu').animate({marginLeft: '0px'});
        });
        setVisible = false;
    }
    else {
        $(document).ready(function() {
            $('#main').animate({marginLeft: '0px'});
            $('#menu').animate({marginLeft: '-250px'});
        });
        setVisible = true;
    }
}

function closeAllWindow() {
    $('#divUserList').remove();
    $('#divForRegForm').remove();
    $('#divForUpdateData').remove();
    $('#divForDeleteUser').remove();
    $('#SiteSettings').remove();
    $('#readCommentDiv').remove();
    $('#divForRequestsAdmin').remove();
    $('#divForDisableEnable').remove();
    $('#divForDisableBlock').remove();
    butttonCount = 1;
    DisableSortPosition = 1;
}

function OpenRegForm() {
    closeAllWindow();
    $('#mainTypeIn').append('<div id="divForRegForm">' +
        '<h3 id="hForm">Register form</h3><hr id="regUp"><form id="regForm">' +
        '<label>Name:</label><input type="text" placeholder="First" id="fName" required> ' +
        '<input type="text" placeholder="Last" id="lName" required><br>' +
        '<label>Phone number:</label><input type="text" pattern="^7\\d{9}$|^7\\d{2}\\s\\d{3}\\s\\d{2}\\s\\d{2}$" placeholder="775 778 21 41" id="phoneNum" required><br>' +
        '<label>E-mail:</label><input type="email" placeholder="example@gmail.com" id="email" pattern="^[a-z0-9](\.?[a-z0-9]){5,}@gmail\.com?$|^[a-z0-9](\.?[a-z0-9]){5,}@mail\.ru?$" required><br>' +
        '<label>Password:</label><input type="password" placeholder="pass0123" id="pass" pattern="\w{8,}"><br>' +
        '<label>Gender:</label>Male <input type="radio" name="gen" value="Male">' +
        'Female <input type="radio" name="gen" value="Female">' +
        'Other <input type="radio" name="gen" value="Other" checked>' +
        '<label>|</label><label>Banned</label>' +
        '<input type="checkbox" id="ban" onclick="bannedInRegFormReasonsShow()"><br><hr id="regUp">' +
        '<button id="addUser" onclick="RegisterFunc()">Add user</button></form></div>');
    $('#divForRegForm').css({display: 'block'});
    $('#divForRegForm').animate({width: '600px'});
    $('#divForRegForm').animate({height: '400px'});

}
function bannedInRegFormReasonsShow() {
    let banned = $('input[id=ban]:checked').val();
    banned = (banned === "on");
    if(!banned){
        $('#divForRegForm').css("height", "400px");
        $('#reasonDivInRegForm').remove();
    }
    else{
        $('#divForRegForm').css("height", "600px");
        $('#reasonDivInRegForm').remove();
        $('#divForRegForm').append('<div id="reasonDivInRegForm"><label>Reason for the ban:</label><br>' +
            '<textarea rows="8" cols="73" id="textAreaReasonForRegForm"></textarea></div>');
    }
}

function provEmailUnique(email, Users) {
    for(let i of Users) if(i.eMail === email) return true;
    return false;
}

function RegisterFunc() {
    let regex = new RegExp("^7\\d{9}$|^7\\d{2}\\s\\d{3}\\s\\d{2}\\s\\d{2}$", );
    let regexEmail = new RegExp("^[a-z0-9](.?[a-z0-9]){5,}@gmail.com$|^[a-z0-9](.?[a-z0-9]){5,}@mail.ru$", );
    let regexPass = new RegExp("\\w{8,}", );
    if(regex.test($('#phoneNum').val()) && regexEmail.test($('#email').val()) && regexPass.test($('#pass').val())) {
        let firstName = $('#fName').val(), lastName = $('#lName').val(), phoneNum = $('#phoneNum').val(),
            eMail = $('#email').val(), pass = $('#pass').val(), gender = $('input[name="gen"]:checked').val(),
            banned = $('input[id="ban"]:checked').val();
        banned = (banned === "on");
        banned = (banned ? "Yes" : "No");
        let cause = (banned == "Yes" ? $('#textAreaReasonForRegForm').val() : "");
        let Users = JSON.parse(localStorage.getItem('Users') || "[]");
        if(provEmailUnique(eMail, Users)){
            alert("This E-mail " + eMail + " is already registered!");
            OpenRegForm();
            return;
        }
        let User = {
            ban: banned, eMail: eMail, firstName: firstName, gender: gender,
            lastName: lastName, password: pass, phoneNumber: phoneNum, cause: cause
        }
        Users.push(User);
        localStorage.setItem('Users', JSON.stringify(Users));
        alert("User has been registered.\nE-mail: " + eMail + "\nPassword: " + pass);
        OpenRegForm();
    }
}
function searchWordFromUserToList(user, s) {
    if(s.length == 0 || user.lastName.indexOf(s) != -1 || user.firstName.indexOf(s) != -1 ||
        user.eMail.indexOf(s) != -1 || user.phoneNumber.indexOf(s) != -1 ||
        user.password.indexOf(s) != -1) return true;
}
function ListAllUsers(){
    $('tr[id=userIdForRemove]').remove();
    let Users = JSON.parse(localStorage.getItem('Users') || "[]");
    let t = 1;
    let s = ($('#searchUser').val() || "");
    for(let i of Users){
        if(butttonCount == 2 && i.ban == "No")
            if(s.length == 0 || searchWordFromUserToList(i, s)){
                $('#ListAllUsersJS').append('<tr id="userIdForRemove"><td>'
                    + t + '</td><td>' + i.firstName + " " + i.lastName +
                    '</td><td>' + i.eMail + '</td><td>' +
                    i.phoneNumber + '</td><td>' +
                    i.password + '</td><td>' + i.ban + '</td></tr>');
                t++;
            }
        if(butttonCount == 3 && i.ban == "Yes")
            if(s.length == 0 || searchWordFromUserToList(i, s)){
                $('#ListAllUsersJS').append('<tr id="userIdForRemove"><td>'
                    + t + '</td><td>' + i.firstName + " " + i.lastName +
                    '</td><td>' + i.eMail + '</td><td>' +
                    i.phoneNumber + '</td><td>' +
                    i.password + '</td><td>' + i.ban + '</td></tr>');
                t++;
            }
        if(butttonCount == 1)
            if(s.length == 0 || searchWordFromUserToList(i, s)){
                $('#ListAllUsersJS').append('<tr id="userIdForRemove"><td>'
                    + t + '</td><td>' + i.firstName + " " + i.lastName +
                    '</td><td>' + i.eMail + '</td><td>' +
                    i.phoneNumber + '</td><td>' +
                    i.password + '</td><td>' + i.ban + '</td></tr>');
                t++;
            }
    }
}

function clickButtonSort() {
    butttonCount++;
    $('#sortTypeRemove').remove();
    if(butttonCount == 4) butttonCount = 1;
    if(butttonCount == 1) {
        $('#in').animate({marginLeft: '0px'});
        $('#in').append('<p id="sortTypeRemove">All</p>');
    }
    else if(butttonCount == 2) {
        $('#in').animate({marginLeft: '25px'});
        $('#in').append('<p id="sortTypeRemove">No</p>');
    }
    else if(butttonCount == 3) {
        $('#in').animate({marginLeft: '50px'});
        $('#in').append('<p id="sortTypeRemove">Yes</p>');
    }
    ListAllUsers();
}

function UserListShow() {
    closeAllWindow();
    $('#mainTypeIn').append('<div id="divUserList"><label>Search:</label>' +
        '<input type="text" id="searchUser" onKeyUp="ListAllUsers()" placeholder="Write something to search...">' +
        '<div id="out"><div id="in" onclick="clickButtonSort();"><p id="sortTypeRemove">All</p></div></div><hr>' +
        '<div id="UserListTable"><table><thead><tr><th>№</th><th>Name</th><th>E-mail</th><th>Phone number</th>' +
        '<th>Password</th><th>Banned</th></tr></thead><tbody id="ListAllUsersJS"></tbody></table></div><hr></div>');
    $('#divUserList').css({display: 'block'});
    $('#divUserList').animate({width: '1000px'});
    $('#divUserList').animate({height: '600px'});
    ListAllUsers();
}

function UpdateUserDataShowWindow() {
    closeAllWindow();
    $('#mainTypeIn').append('<div id="divForUpdateData"><label>Select user by e-mail</label>' +
        '<input list="users" id="selected" placeholder="example@gmail.com">' +
        '<datalist id="users"></datalist><button onclick="goToUpdate()" id="toUpdate">to update</button></div>');
    $('#divForUpdateData').css({display: 'block'});
    $('#divForUpdateData').animate({width: '800px'});
    $('#divForUpdateData').animate({height: '70px'});
    let Users = JSON.parse(localStorage.getItem('Users') || "[]");
    for(let i of Users){
        $('#users').append('<option value="' + i.eMail + '">');
    }
}

function getUser(a) {
    let Users = JSON.parse(localStorage.getItem('Users') || "[]");
    for(let i of Users) if(i.eMail == a) return i;
    return -1;
}

var userUpdateGlobal = -1;
function goToUpdate() {
    userUpdateGlobal = getUser($('#selected').val());
    $('#formToUpdate').remove();
    $('#divForUpdateData').css("height", "70px");
    if(userUpdateGlobal == -1){
        alert("A user with such mail does not exist :(");
        return;
    }
    $('#divForUpdateData').css("height", "300px");
    $('#divForUpdateData').append('<div id="formToUpdate"><hr id="UpdateHr">' +
        '<label>Name:</label><input type="text" placeholder="First" id="fNameUpdate"> ' +
        '<input type="text" placeholder="Last" id="lNameUpdate" required><br>' +
        '<label>Phone number:</label><input type="text" placeholder="775 778 21 41" id="phoneNumUpdate"><br>' +
        '<label>Password:</label><input type="password" placeholder="pass0123" id="passUpdate"><br>' +
        '<label>Banned</label><input type="checkbox" id="banUpdate" onclick="banReasonShow()">' +
        '<button id="userUpdate" onclick="UpdateData()">Update</button><br></div>')
    $('#fNameUpdate').val(userUpdateGlobal.firstName);
    $('#lNameUpdate').val(userUpdateGlobal.lastName);
    $('#phoneNumUpdate').val(userUpdateGlobal.phoneNumber);
    $('#passUpdate').val(userUpdateGlobal.password);
    $('input[id=banUpdate]').attr('checked', userUpdateGlobal.ban == "Yes");
    if(userUpdateGlobal.ban == "Yes"){
        $('#divForUpdateData').css("height", "500px");
        $('#reasonDiv').remove();
        $('#formToUpdate').append('<div id="reasonDiv"><label>Reason for the ban:</label><br>' +
            '<textarea rows="8" cols="86" id="textAreaReason">' + userUpdateGlobal.cause + '</textarea></div>');
    }
    else{
        $('#divForUpdateData').css("height", "300px");
        $('#reasonDiv').remove();
    }
}
function banReasonShow() {
    let banned = $('input[id=banUpdate]:checked').val();
    banned = (banned === "on");
    if(!banned) {
        $('#divForUpdateData').css("height", "300px");
        $('#reasonDiv').remove();
    }
    else{
        $('#divForUpdateData').css("height", "500px");
        $('#reasonDiv').remove();
        $('#formToUpdate').append('<div id="reasonDiv"><label>Reason for the ban:</label><br>' +
            '<textarea rows="8" cols="86" id="textAreaReason">' + userUpdateGlobal.cause + '</textarea></div>');
    }
}
function UpdateData() {
    let regex = new RegExp("^7\\d{9}$|^7\\d{2}\\s\\d{3}\\s\\d{2}\\s\\d{2}$", );
    let regexPass = new RegExp("\\w{8,}", );
    let firstName = $('#fNameUpdate').val(), lastName = $('#lNameUpdate').val(), phoneNum = $('#phoneNumUpdate').val(),
        pass = $('#passUpdate').val(), banned = $('input[id=banUpdate]:checked').val(), pre = $('#textAreaReason').val() || "";
    banned = (banned === "on");
    if(regex.test(phoneNum) && regexPass.test(pass) && firstName.length > 0 && lastName.length > 0 &&
        pass.length > 0 && phoneNum.length > 0){
        let Users = JSON.parse(localStorage.getItem('Users') || "[]");
        for(let i of Users){
            if(i.eMail == userUpdateGlobal.eMail){
                i.firstName = firstName;
                i.lastName = lastName;
                i.phoneNumber = phoneNum;
                i.password = pass;
                if(banned){
                    i.ban = "Yes";
                    i.cause = pre;
                }
                else{
                    i.ban = "No";
                    i.cause = "";
                }
                localStorage.setItem('Users', JSON.stringify(Users));
                alert("New data: " + userUpdateGlobal.eMail + "\nName: " + firstName + " " + lastName + ",\nPhone number: " + phoneNum + ", \n" +
                "Password: " + pass + ",\nBanned: " + i.ban + (banned ? ",\nReason for ban:\n" + pre : "."));
                break;
            }
        }
    }
    else{
        alert("Invalid format :(");
    }
}

function ShowWindowForDeleteUser() {
    closeAllWindow();
    $('#mainTypeIn').append('<div id="divForDeleteUser"><label>Select user by e-mail</label>' +
        '<input list="usersGmail" id="selectedUserToDelete" placeholder="example@gmail.com">' +
        '<datalist id="usersGmail"></datalist><button onclick="deleteUser()">Delete account</button></div>');
    $('#divForDeleteUser').css({display: 'block'});
    $('#divForDeleteUser').animate({width: '750px'});
    $('#divForDeleteUser').animate({height: '70px'});
    let Users = JSON.parse(localStorage.getItem('Users') || "[]");
    for(let i of Users) $('#usersGmail').append('<option value="' + i.eMail + '">');
}

function deleteUser() {
    let Users = JSON.parse(localStorage.getItem('Users') || "[]");
    let email = $('#selectedUserToDelete').val();
    $('#selectedUserToDelete').val('');
    for(let i = 0; i < Users.length; i++){
        if(Users[i].eMail == email){
            Users.splice(i, 1);
            let Request = JSON.parse(localStorage.getItem('Request') || "[]");
            for(let j = 0; j < Request.length; j++){
                if(Request[j].user == email){
                    Request.splice(j, 1);
                    j--;
                }
            }
            localStorage.setItem('Request', JSON.stringify(Request));
            let CommentsUser = JSON.parse(localStorage.getItem('CommentsUser') || "[]");
            for(let j = 0; j < CommentsUser.length; j++){
                if(CommentsUser[j].user == email){
                    CommentsUser.splice(j, 1);
                    j--;
                }
            }
            localStorage.setItem('CommentsUser', JSON.stringify(CommentsUser));
            swal("Nice!", "Account " + email + " has been deleted ;)", "success");
            localStorage.setItem('Users', JSON.stringify(Users));
            closeAllWindow();
            ShowWindowForDeleteUser();
            return;
        }
    }
    swal("Nice!", "Unable to delete. User " + email + " does not exist.", "warning");
}

function changeTheBackground(imageToThis) {
    $('body').css('background-image', 'url(' + imageToThis + ')');
}

var backGrounds = ['P18_0841_a5_rgb.jpg', 'porsche-911-carrera-992-2019.jpg', 'wallhaven-456o79.jpg',
    'wallhaven-lmp68l.jpg', 'wallhaven-nmvk39.jpg', 'wallhaven-nrqyzq.jpg', 'wallhaven-ey2ogw.jpg'];

function SiteSettingsShowWindow() {
    closeAllWindow();
    $('#mainTypeIn').append('<div id="SiteSettings"><h2>Background</h2>' +
        '<img src="../AdminPage/P18_0841_a5_rgb.jpg" onclick="changeTheBackground(\'P18_0841_a5_rgb.jpg\')">' +
        '<img src="../AdminPage/porsche-911-carrera-992-2019.jpg" onclick="changeTheBackground(\'porsche-911-carrera-992-2019.jpg\')">' +
        '<img src="../AdminPage/wallhaven-456o79.jpg" onclick="changeTheBackground(\'wallhaven-456o79.jpg\')">' +
        '<img src="../AdminPage/wallhaven-lmp68l.jpg" onclick="changeTheBackground(\'wallhaven-lmp68l.jpg\')">' +
        '<img src="../AdminPage/wallhaven-nmvk39.jpg" onclick="changeTheBackground(\'wallhaven-nmvk39.jpg\')">' +
        '<img src="../AdminPage/wallhaven-nrqyzq.jpg" onclick="changeTheBackground(\'wallhaven-nrqyzq.jpg\')">' +
        '<img src="../AdminPage/wallhaven-ey2ogw.jpg" onclick="changeTheBackground(\'wallhaven-ey2ogw.jpg\')">' +
        '</div></div>');
    $('#SiteSettings').css({display: 'block'});
    $('#SiteSettings').animate({width: '1045px'});
    $('#SiteSettings').animate({height: '500px'});
}

function RegistrationPageUser() {
    let Users = JSON.parse(localStorage.getItem('Users') || "[]");
    if($('#passRegPage').val() != $('#rePassRegPage').val()){
        swal("Oops!", "Password mismatch!", "warning");
        return false;
    }
    for(let i of Users){
        if(i.eMail == $('#emailRegPage').val()){
            swal("Oops!", "The user with e-mail " + i.eMail + " already exists!", "warning");
            return false;
        }
    }
    let User = {ban: "No", cause: "", eMail: $('#emailRegPage').val(), firstName: $('#firstNameRegPage').val(), gender: $('input[name="genderRegPage"]:checked').val(),
        lastName: $('#lastNameRegPage').val(), password: $('#passRegPage').val(), phoneNumber: $('#phoneNumRegPage').val()};
    Users.push(User);
    localStorage.setItem('Users', JSON.stringify(Users));
    alert("Congratulations, you are registered!");
    return true;
}
function checkLogAndPass() {
    let email = $('#emailLogInPage').val(), pass = $('#passLogInPage').val();
    let Users = JSON.parse(localStorage.getItem('Users') || "[]");
    for(let i of Users){
        if(i.eMail == email){
            if(i.password != pass){
                swal("Oops!", "Wrong password!", "warning");
                return false;
            }
            else{
                if(i.ban == "Yes"){
                    swal("Oops!", "You have been banned by the administrator\nCause of the blocking: " + i.cause, "warning");
                    return false;
                }
                else {
                    localStorage.setItem('authUser', JSON.stringify(i));
                    return true;
                }
            }
        }
    }
    swal("Oops!", "You are not registred!", "warning");
    return false;
}
function openForForInLogFormUser() {
    $(".containerLogForm").css({display: 'block'});
    $(".containerLogForm").animate({width: '700px'});
    $(".containerLogForm").animate({height: '600px'});
}
function openForForInRegFormUser() {
    $(".container").css({display: 'block'});
    $(".container").animate({width: '900px'});
    $(".container").animate({height: '700px'});
}

function addCommentsToTableInCommentAdmin() {
    $('tr[id="commentTrIdForRemove"]').remove();
    let CommentsUser = JSON.parse(localStorage.getItem('CommentsUser') || "[]");
    for(let i of CommentsUser){
        $('#samReadComment tbody').append('<tr id="commentTrIdForRemove"><td>' + i.user + '</td><td><textarea rows="7" cols="80">' + i.comment + '</textarea></td></tr>')
    }
}


function createDivTableForCommentsAdmin() {
    closeAllWindow();
    $('#mainTypeIn').append('<div id="readCommentDiv"><table><thead><tr>' +
        '<th>User</th><th>Comments</th></tr></thead></table><hr>' +
        '<div id="samReadComment">' +
        '<table><tbody></tbody></table></div><hr></div>');

    $('#readCommentDiv').css({display: 'block'});
    $('#readCommentDiv').animate({width: '1000px'});
    $('#readCommentDiv').animate({height: '570px'});
    addCommentsToTableInCommentAdmin();
}


function getAllRequestsTable() {
    let Request = JSON.parse(localStorage.getItem('Request') || "[]"), t = 1, k = 0;
    localStorage.setItem('Request', JSON.stringify(Request));
    $('tr[id="forDeleteRequestAdmin"]').remove();
    let s = $('#searchRequestID').val() || "";
    for(let i of Request){
        if(i.ans.length == 0) {
            if(i.user.indexOf(s) != -1 || i.type.indexOf(s) != -1 || i.carName.indexOf(s) != -1) {
                $('#samDivForRequestsAdmin tbody').append('<tr id="forDeleteRequestAdmin"><td>' + t + '</td>' +
                    '<td>' + i.user + '</td><td>' + i.type + '</td><td>' + i.carName + '</td>' +
                    '<td><textarea id="textAreaAnswer' + k + '" cols="35" rows="5"></textarea>' +
                    '<button onclick="saveAnswerAdminRequest(' + k + ')">Save</button></td></tr>');
                t++;
            }
        }
        k++;
    }

}

function saveAnswerAdminRequest(a) {
    let Request = JSON.parse(localStorage.getItem('Request') || "[]");
    let s = $('#textAreaAnswer' + a).val() || "";
    if(s.length == 0) return;
    Request[a].ans = s;
    localStorage.setItem('Request', JSON.stringify(Request));
    swal("Nice!", "Your answer has been saved.", "success");
    getAllRequestsTable();
}

function openRequestWindow() {
    closeAllWindow();
    $('#mainTypeIn').append('<div id="divForRequestsAdmin"><label>Search:</label>' +
        '<input id="searchRequestID" type="text" onkeyup="getAllRequestsTable()" placeholder="Write something to search...">' +
        '<hr><table><thead><tr><th>№</th><th>User</th><th>Type</th><th>Car</th><th>Answer</th></tr></thead>' +
        '</table><hr><div id="samDivForRequestsAdmin"><table><tbody></tbody></table></div><hr></div>');
    $('#divForRequestsAdmin').css({display: 'block'});
    $('#divForRequestsAdmin').animate({width: '1000px'});
    $('#divForRequestsAdmin').animate({height: '570px'});
    getAllRequestsTable()
}


function changePosInNew() {
    DisableSortPosition++;
    if(DisableSortPosition == 4) DisableSortPosition = 1;
    $('#sortTypeDisableEnable').remove();
    if(DisableSortPosition == 1) {
        $('#inNew').animate({marginLeft: '0px'});
        $('#inNew').append('<p id="sortTypeDisableEnable">All</p>');
    }
    else if(DisableSortPosition == 2) {
        $('#inNew').animate({marginLeft: '25px'});
        $('#inNew').append('<p id="sortTypeDisableEnable">No</p>');
    }
    else if(DisableSortPosition == 3) {
        $('#inNew').animate({marginLeft: '50px'});
        $('#inNew').append('<p id="sortTypeDisableEnable">Yes</p>');
    }
    getAllUsersForDisableEnable();
}

function getAllUsersForDisableEnable() {
    let Users = JSON.parse(localStorage.getItem('Users') || "[]");
    let t = 1, k = 0;
    let s = $('#searchDisableEnable').val() || "";
    $('tr[id="forRemoveDisEnTr"]').remove();
    for(let i of Users) {
        if(DisableSortPosition == 2 && i.ban == "No") {
            if(s.length == 0 || i.eMail.indexOf(s) != -1){
                $("#samDivForDisableEnable tbody").append('<tr id="forRemoveDisEnTr"><td>' + t + '</td>' +
                    '<td>' + i.eMail + '</td>' +
                    '<td>No,<button onclick="bunUserAdminDisableEnable(' + k + ')">Block</button></td></tr>');
                t++;
            }
        }
        if(DisableSortPosition == 3 && i.ban == "Yes"){
            if(s.length == 0 || i.eMail.indexOf(s) != -1) {
                $("#samDivForDisableEnable tbody").append('<tr id="forRemoveDisEnTr"><td>' + t + '</td>' +
                    '<td>' + i.eMail + '</td>' +
                    '<td>Yes,<button onclick="unBlockUserAdminDisableEnable(' + k + ')">Unblock</button></td></tr>');
                t++;
            }
        }
        if(DisableSortPosition == 1){
            if(s.length == 0 || i.eMail.indexOf(s) != -1) {
                if (i.ban == "No") {
                    $("#samDivForDisableEnable tbody").append('<tr id="forRemoveDisEnTr"><td>' + t + '</td>' +
                        '<td>' + i.eMail + '</td>' +
                        '<td>No,<button onclick="bunUserAdminDisableEnable(' + k + ')">Block</button></td></tr>');
                } else {
                    $("#samDivForDisableEnable tbody").append('<tr id="forRemoveDisEnTr"><td>' + t + '</td>' +
                        '<td>' + i.eMail + '</td>' +
                        '<td>Yes,<button onclick="unBlockUserAdminDisableEnable(' + k + ')">Unblock</button></td></tr>');
                }
                t++;
            }
        }
        k++;
    }
}

function bunUserAdminDisableEnable(a) {
    closeAllWindow();
    let Users = JSON.parse(localStorage.getItem('Users') || "[]");
    $('#mainTypeIn').append('<div id="divForDisableBlock">' +
        '<h3>You are going to block the user: ' + Users[a].eMail + '</h3>' +
        '<textarea cols="95" rows="23" id="textAreaForDisableAdmin"></textarea>' +
        '<button onclick="disableOrEnableAction(1, ' + a + ')">Cancel</button>' +
        '<button onclick="disableOrEnableAction(2, ' + a + ')">Save</button>' +
        '</div>');
    $('#divForDisableBlock').css({display: 'block'});
    $('#divForDisableBlock').animate({width: '750px'});
    $('#divForDisableBlock').animate({height: '500px'});
}

function unBlockUserAdminDisableEnable(a) {
    let Users = JSON.parse(localStorage.getItem('Users') || "[]");
    swal("Do you really want to unlock?\nCause of the blocking: " + Users[a].cause,{
        buttons: {
            Cancel: "Cancel",
            Yes: true
        }
    }).then((value) => {
        if(value == "Yes"){
            swal("Nice!", "The user was enabled!", "success");
            Users[a].ban = "No";
            Users[a].cause = "";
            localStorage.setItem('Users', JSON.stringify(Users));
            getAllUsersForDisableEnable();
        }
    });
}


function openWindowDisableEnable() {
    closeAllWindow();
    $('#mainTypeIn').append('<div id="divForDisableEnable"><label>Search:</label>' +
        '<input id="searchDisableEnable" onkeyup="getAllUsersForDisableEnable()" type="text" placeholder="Write something to search...">' +
        '<div id="outNew"><div id="inNew" onclick="changePosInNew()"><p id="sortTypeDisableEnable">All</p></div></div>' +
        '<hr><table><thead><tr><th>№</th><th>User</th><th>Banned</th></tr></thead></table><hr><div id="samDivForDisableEnable">' +
        '<table><tbody></tbody></table></div><hr></div>');
    $('#divForDisableEnable').css({display: 'block'});
    $('#divForDisableEnable').animate({width: '700px'});
    $('#divForDisableEnable').animate({height: '570px'});
    getAllUsersForDisableEnable();
}

function disableOrEnableAction(a, n) {
    if(a == 2){
        swal("Do you want to block a user?", {
            buttons: {
                Cancel: "Cancel",
                Yes: true
            }
        }).then((value) => {
            if(value == "Yes"){
                swal("Nice!", "The user was disabled!", "success");
                let Users = JSON.parse(localStorage.getItem('Users') || "[]");
                Users[n].ban = "Yes";
                Users[n].cause = $('#textAreaForDisableAdmin').val() || "";
                localStorage.setItem('Users', JSON.stringify(Users));
                openWindowDisableEnable();
            }
        });
    }
    else{
        swal("Do you want to cancel the surgery?", {
            buttons: {
                Cancel: "Cancel",
                Yes: true
            }
        }).then((value) => {
            if(value == "Yes"){
                openWindowDisableEnable();
            }
        });
    }
}

function LogOut() {
    window.location.replace("../../home.html");s
}