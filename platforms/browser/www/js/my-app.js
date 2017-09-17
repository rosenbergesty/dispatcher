// Initialize app
var myApp = new Framework7({
    template7Pages: true
});
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true
});

$$(document).on('deviceready', function() {
    if(loggedIn()){
        // redirect
        mainView.router.loadPage('drivers.html');
    }

    $$('#login').click(function(e){
        var email = $$('#email').val().toLowerCase();
        var password = $$('#password').val();

        $$.post('http://estyrosenberg.com/guma/fetch-dispatcher-by-email.php', {email: email}, function(data){
            var data = JSON.parse(data);
            if(data == '0 results'){
                myApp.alert("Invalid email address. Please try again.", "");
            } else {
                if(data[0].password == password){
                    localStorage.setItem('login', data[0].ID);
                    mainView.router.loadPage('drivers.html');
                } else {
                    myApp.alert("Invalid password. Please try again", "");
                }   
            }
        }, function(xhr, status){
            console.log(xhr);
            console.log(status);
        });
    });
});

function loggedIn(){
    var userId = localStorage.getItem('login');
    if(userId != null){
        return true;
    }
}

// Logout 
myApp.onPageInit('*', function(page){
    $$('.logout').click(function(e){
        localStorage.removeItem('login');
        mainView.router.loadPage('index.html');
    });
    

    $$('#login').click(function(e){
        var email = $$('#email').val().toLowerCase();
        var password = $$('#password').val();

        $$.post('http://estyrosenberg.com/guma/fetch-dispatcher-by-email.php', {email: email}, function(data){
            var data = JSON.parse(data);
            if(data == '0 results'){
                myApp.alert("Invalid email address. Please try again.", "");
            } else {
                if(data[0].password == password){
                    localStorage.setItem('login', data[0].ID);
                    mainView.router.loadPage('drivers.html');
                } else {
                    myApp.alert("Invalid password. Please try again", "");
                }   
            }
        }, function(xhr, status){
            console.log(xhr);
            console.log(status);
        });
    });

})

// Drivers
myApp.onPageInit('drivers', function(page){
    // Drivers list
    var mySearchbar = myApp.searchbar('.searchbar', {
        searchList: '.list-block-search',
        searchIn: '.item-title'
    });   

    var drivers = [];
    var driverList = myApp.virtualList('.list-block', {
        items: drivers,
        template: '<a href="stops.html" data-context=\'{"name": "{{name}}", "id": {{id}}}\' class="item-content item-link">'+
                    '<div class="item-inner">'+
                        '<div class="item-title">{{name}}</div>'+
                    '</div>'+
                   '</a>',
        searchAll: function(query, items){
            var foundItems = [];
            for(var i = 0; i < items.length; i++){
                if(items[i].title.indexOf(query.trim()) >= 0) foundItems.push(i);
            }
            return foundItems;
        }, 
        height: 44
    });

    $$.post('http://estyrosenberg.com/guma/fetch-all-drivers.php', function(data){
        $$.each(JSON.parse(data), function(index, value){
            driverList.appendItem({
                name: value.name,
                id: value.ID
            });
        });
    }, function(xhr, status){
        console.log(xhr);
        console.log(status);
    });
});

// Stops
myApp.onPageInit('stops', function(page){
    driverId = page.context.id;

    var stops = myApp.messages('.messages', {
        autoLayout: true,
        messageTemplate: '{{#if day}}'+
            '<div class="messages-date">{{day}} {{#if time}}, <span>{{time}}</span>{{/if}}</div>' + 
            '{{/if}}' + 
            '<a href="#" data-id="{{id}}" class="message-link"><div class="message message-{{type}}">' +
            '{{#if name}}<div class="message-name">{{name}}</div>{{/if}}' +
            '<div class="message-text">{{text}}{{#if date}}<div class="message-date">{{date}}</div>{{/if}}</div>' +
            '{{#if label}}<div class="message-label">{{label}}</div>{{/if}}'+
            '</div></a>'
    });

    var count = 0;

    $$.post('http://estyrosenberg.com/guma/fetch-stops-by-driverId.php', {driverID: driverId}, function(data){
        if(JSON.parse(data) != '0 results'){
            $$('.empty-state').hide();
            var date = "";
            var newDate = false;
            stops.clean();

            $$.each(JSON.parse(data), function(index, value){
                // add time string
                if(value.dateCreated != date){
                    date = value.dateCreated;
                    stops.addMessage({
                        text: "Address: " + value.address + 
                                "<br>Size: " + value.size + 
                                "<br>Action: " + value.type,
                        id: value.ID,
                        date: value.date,
                        time: value.time
                    });
                } else {
                    stops.addMessage({
                        text: "Address: " + value.address + 
                                "<br>Size: " + value.size + 
                                "<br>Action: " + value.type,
                        id: value.ID,
                        date: value.date,
                        time: value.time
                    });
                }
                $$('.message-link').on('click', function(){
                    var msgId = $$(this).data('id');

                    var clickedLink = this;
                    var popoverHtml = '<div class="popover delete-popover">'+
                                        '<div class="popover-inner">'+
                                          '<div class="list-block">'+
                                            '<ul>'+
                                              '<li><a href="#" class="item-link list-button delete-button">Delete</li>'+
                                            '</ul>'+
                                          '</div>'+
                                        '</div>'+
                                      '</div>';
                    myApp.popover(popoverHtml, clickedLink);

                    $$('.delete-button').on('click', function(){
                        $$.post('http://estyrosenberg.com/guma/delete-stop.php', {stopId: msgId}, function(data){
                            if(JSON.parse(data)[0].code == '200'){
                                refresh();
                            } else {
                                myApp.alert("Something went wrong. Try again or contact the developer.", "");
                            }
                        });
                    })
                });

            });


        }
    });

    $$('.messagebar #size .button').click(function(){
        $$('.messagebar #size .button').removeClass('active');
        $$(this).addClass('active');
    });
    $$('.messagebar #action .button').click(function(){
        $$('.messagebar #action .button').removeClass('active');
        $$(this).addClass('active');
    });

    $$('#add').click(function(){        
        // Get values of address, size and action
        var address = $$('#address').val();
        var size = $$('#size .button.active').text();
        var action = $$('#action .button.active').text();

        // Show alert if not valid
        var error = false;
        if(address.length <= 0){
            myApp.alert('Please enter the address', 'Address');
            error = true;
        }

        // Save as stop
        if(!error){
            var datetime = new Date();
            var date = (datetime.getMonth() + 1)+"/"+datetime.getDate ()+"/"+datetime.getFullYear();
            var time = datetime.getHours()+":"+datetime.getMinutes()+":"+datetime.getSeconds();
            $$.post('http://estyrosenberg.com/guma/add-stop.php', {
                address: address,
                size: size,
                action: action,
                driverId: driverId,
                status: 'pending',
                date: date,
                time: time
            }, function(data){
                if(JSON.parse(data)[0].code == '200'){
                    refresh();
                } else {
                    myApp.alert("Something went wrong. Try again or contact the developer.", "");
                }
            });
        }
    });

    function refresh(){
        stops.clean();

        $$.post('http://estyrosenberg.com/guma/fetch-stops-by-driverId.php', {driverID: driverId}, function(data){
            if(JSON.parse(data) != '0 results'){
                $$('.empty-state').hide();
                var date = "";
                var newDate = false;
                stops.clean();

                $$.each(JSON.parse(data), function(index, value){
                    // add time string
                    if(value.dateCreated != date){
                        date = value.dateCreated;
                        stops.addMessage({
                            text: "Address: " + value.address + 
                                    "<br>Size: " + value.size + 
                                    "<br>Action: " + value.type,
                            id: value.ID,
                            date: value.date,
                            time: value.time
                        });
                    } else {
                        stops.addMessage({
                            text: "Address: " + value.address + 
                                    "<br>Size: " + value.size + 
                                    "<br>Action: " + value.type,
                            id: value.ID,
                            date: value.date,
                            time: value.time
                        });
                    }
                    $$('.message-link').on('click', function(){
                        var msgId = $$(this).data('id');

                        var clickedLink = this;
                        var popoverHtml = '<div class="popover delete-popover">'+
                                            '<div class="popover-inner">'+
                                              '<div class="list-block">'+
                                                '<ul>'+
                                                  '<li><a href="#" class="item-link list-button delete-button">Delete</li>'+
                                                '</ul>'+
                                              '</div>'+
                                            '</div>'+
                                          '</div>';
                        myApp.popover(popoverHtml, clickedLink);

                        $$('.delete-button').on('click', function(){
                            $$.post('http://estyrosenberg.com/guma/delete-stop.php', {stopId: msgId}, function(data){
                                if(JSON.parse(data)[0].code == '200'){
                                    refresh();
                                } else {
                                    myApp.alert("Something went wrong. Try again or contact the developer.", "");
                                }
                            });
                        })
                    });

                });


            }
        });
    }    
});

