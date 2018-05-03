$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: 'api/user', 
        dataType: 'json',
    })
    .done(successHandler)
    .fail(errorHandler)

    contactList();
    $("#gohome").click(contactList);
    $("#addnew").click(newContact);

    $('#submit').click(() => {
            const user = {
                name: $('input[name=name]').val(),
                email: $('input[name=email]').val(),
                phone: $('input[name=phone]').val()
            }
            if (validation(user) == true){
                const requestData = JSON.stringify(user)
            
                $.ajax({
                        type: 'POST',
                        url: 'api/user', 
                        data: requestData,
                        dataType: 'json',
                        contentType: 'application/json',
                    })
                    .done(successHandler)
                    .fail(errorHandler)
                    getDetails(user);
                }   
            $.ajax({
                    type: 'POST',
                    url: 'api/user', 
                    data: requestData,
                    dataType: 'json',
                    contentType: 'application/json',
                })
                .done(successHandler) 
                .fail(errorHandler)   
    })
            

    $("#submit").click(function(user){
        getDetails(user);
        $("#specificdetail").show();
        $("#contactlist").hide();
        $("#newcontact").hide();
        $("#editpage").hide();
    })   
})

function validation(user){
    var phoneregex = /^((?![0-1])[0-9]{10})$/g;
    if(phoneregex.test(user.phone) == false){
        alert("Phone number must be 10 numbers long and cannot start with 0 or 1");
        return false;
    }
    var emailregex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (emailregex.test(user.email) == false) {
        alert('Email is invalid');
        return false;
    }
    if (user.name.length == 0){
        alert('You must enter a name');
        return false;
    }
    return true;
}

function successHandler(users) {
    console.log(`Response has ${users.length} users`)
    var $table = $( "<table border='1'><tr><th>#&nbsp&nbsp</th><th>Name</th><th>Email</th><th>Phone</th></table>" );
    for ( let index = 0; index < users.length; index++ ) {
        const user = users[index]
        const $line = $( "<tr></tr>" )
        $line.append( $( "<td></td>" ).html( user.id ) )
        $line.append( $( "<td></td>" ).html( user.name ) )
        $line.append( $( "<td></td>" ).html( user.email ) )
        $line.append( $( "<td></td>").html( user.phone ) )
        $line.append( $( "<td>"))

        const blueDetails = $( "<button id = 'blue'>/button>" ).text('Details');
        $line.append(blueDetails)

        const yellowEdit = $( "<button id = 'yellow'>/button>" ).text('Edit');
        $line.append(yellowEdit)

        const redDelete = $( "<button id = 'red'>/button>" ).text('Delete');
        $line.append(redDelete)
        $line.append( $( "</td>"))
        $table.append( $line )
            redDelete.click(() => {
                const confirmDelete = confirm("Are you sure?")
                if (confirmDelete) {
                    deleteContact(user.id);
                    contactList();
                }
            })
            blueDetails.click(() => {
                getDetails(user);
            })
            yellowEdit.click(() => {
                editPage(user);
            })

    }
    $('#output').empty()
    $table.appendTo( $('#output') )
    detailOutput(users); 
}

function errorHandler(jqXHR, textStatus, error) {
    $('#output').val("textStatus: " + textStatus + ". server error: " + error)
}

function contactList(){
    $("#contactlist").show();
    $("#newcontact").hide();

    $("#editpage").hide();
    $("#specificdetail").hide();
}

function newContact(){
    $("#newcontact").show();
    $("#contactlist").hide();

    $("#editpage").hide();
    $("#specificdetail").hide();
}

function detailPage(user){
    $('#specificusercontent').empty();
    user=JSON.parse(user)
    $('#specificusercontent').html('<label for="name">Name: </label><strong>'+user.name+'</strong><br><label for="email">Email: </label><strong>'+user.email+'</strong><br><label for="phone">Phone: </label><strong>'+user.phone+'</strong>')

    const yellowEdit = $("<button id = 'editdetail'></button>").text('Edit');
    yellowEdit.click(() => {
        editPage(user) 
    });
    $('#specificusercontent').append(yellowEdit)
    const redDelete = $("<button id = 'deletedetail'></button>").text('Delete');
    redDelete.click(() => {
        const confirmDelete = confirm("Are you sure?")
        if (confirmDelete) {
            deleteContact(user.id);
            contactList();
        }
    })
    $('#specificusercontent').append(redDelete)


    $("#specificdetail").show();
    $("#contactlist").hide();
    $("#newcontact").hide();
    $("#editpage").hide();
    $("#detailoutput").hide();
}

function editPage(user){
    $("#detailoutput").hide();
    $("#contactlist").hide();
    $("#newcontact").hide();
    $("#editpage").show();
    $("#specificdetail").hide();

    $('input[name=nameedit]:text').val(`${user.name}`);
    $('input[name=emailedit]:text').val(`${user.email}`);
    $('input[name=phoneedit]:text').val(`${user.phone}`);

    const editSubmit = $("<button id = 'submit'></button>").text('Submit');
    $('#editbutton').html(editSubmit);
    editSubmit.click(() => {
        let contactChanged = {
            id: user.id,
            name: $('input[name=nameedit]').val(),
            email: $('input[name=emailedit]').val(),
            phone: $('input[name=phoneedit]').val(),
        }
        if (validation(contactChanged) == true){

            alert("Success")
            editUser(contactChanged);
            contactList();
        }
        else{
            editPage(user);
        }
    });
}

function deleteContact(id){
    $.ajax({
        type: 'DELETE',
        url: `api/user/${id}`,
        dataType: 'json',
    })
    .done(successHandler)
    .fail(errorHandler)
}

function getDetails(user){
    $.ajax({
        type: 'POST',
        url: 'api/user/specificuser',
        data: JSON.stringify(user),
        contentType: 'application/json',
        dataType: 'json',
    })
    .done(detailPage)
    .fail(errorHandler)
}

function editUser(contactChanged) {
    $.ajax({
        type: 'PUT',
        url: `api/user/${contactChanged.id}`,
        data: JSON.stringify(contactChanged),
        contentType: 'application/json',
        dataType: 'json',
    })
    .done(successHandler)
    .fail(errorHandler)
}