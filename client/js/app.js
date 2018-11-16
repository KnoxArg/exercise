(function () {
	'use strict';

    var counter = 0;

    let updateCounter = function(){
        $("#counter").text(counter);
    }
    let addItemToList = function(element){
        counter++;	
        let li = '<li  class="ui-state-default" id="' + element.item_id +'">' +
                    '<img height="50" src="' + element.b64image + '" />' +
                    '<span style="word-wrap:break-word;">' + element.description + '</span>' +
                    '<button class="btn smooth btn-a btn-sm edit">Edit</button>' +
                    '<button class="btn smooth btn-c btn-sm delete">Delete</button>' +
                    '</li>';
        updateCounter();
        $("#sortable").append(li);
    };

    let editItemInList = function(element){
        let li = $("#"+element.item_id);
        li.find('img').attr("src",element.b64image);
        li.find('span').text(element.description);
    };

    let saveItem = function(element, update = false){
        let verb = "POST";
        let endpoint = "http://localhost:3000/items";
        if (update){
            verb = "PUT";
            endpoint = "http://localhost:3000/item/" + element.item_id;
        }
        
        fetch(endpoint,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: verb,
            body: JSON.stringify(element)
        })
        .then(function(res){ 
            if(!update){
                addItemToList(element);
            }else{
                editItemInList(element);
            }
        })  
    }

    let clearForm = function(){
        $("input[name='add1']").val('');
        $("#img").attr("src", '');
        $("#btnAdd").data("type","add");
        $("#btnAdd").val("Add");
        $("#inp").val('');
    };

    function readFile() {
        let file, img;
        img = new Image();

        img.onload = function() {
            if (this.width >= 320 && this.height >= 320 ) {
                
                document.getElementById("img").src       = img.src;
                document.getElementById("b64").innerHTML = img.src;
            }else{
                alert('Dimensiones inválidas. Máximo permitido 320x320');
            }
        }
        if (this.files && this.files[0]) {		
            let FR = new FileReader();
            FR.addEventListener("load", function(e) {
                img.src = e.target.result;
                
            }); 
            FR.readAsDataURL( this.files[0] );
        }

    }

    document.getElementById("inp").addEventListener("change", readFile);

    $(document).ready(function () {
        let cantItems = 0;
        $('ul').sortable({
                axis: 'y',
                update: function (event, ui) {
                    let data = $(this).sortable('serialize');
                    $('#posted').text(data);
                    fetch("http://localhost:3000/updateorder",
                    {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        method: "POST", 
                        body: JSON.stringify({"order": data})
                    })
                }
            });
        $.ajax({
                url: "http://localhost:3000/items",
                dataType: 'json',
                success: function(data){
                    data.forEach(element => {
                        addItemToList(element)
                    });
                    $("#sortable").sortable('refresh');

                    
                    $("#sortable").on('click','.delete', function() { 
                        let id = $(this).parent().attr("id");
                        let parent = $(this).parent();
                        
                        fetch("http://localhost:3000/items/" + id,
                        {
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            method: "DELETE"
                        })
                        .then(function(res){ 
                            parent.remove();
                            counter--;
                            updateCounter();
                        }) 
                    });

                    $("#sortable").on('click','.edit',function() { 
                        let id = $(this).parent().attr("id");
                        $("input[name='add1']").val($(this).parent().find('span').text());
                        $("#idItem").val(id);
                        $("#img").attr("src", $(this).parent().find('img').attr("src") );
                        $("#btnAdd").data("type","edit");
                        $("#btnAdd").val("Edit");
                    });
                }
        });

            
    });

        
    $("#btnAdd").click(function (e) {
        e.preventDefault(); //The event.preventDefault() method stops the default action of an element from happening. 
                            //Given the button is submit we don't want it to do default behavior
                     
        
    

        let item_id = "";
        if ($(this).data("type") == "add"){
            item_id = 'item_' + Date.now();
        }else{
            item_id = $("#idItem").val();
        }
        let description = $("input[name='add1']").val();
        let image = $("#img").attr("src");

        if (!image || !description ){
            alert('Please enter required fields');
        }else{
            let element  = {"item_id" : item_id, 
                        "b64image" : image,
                        "description" : description};
            if ($(this).data("type") == "add")
                saveItem(element);
            else
                saveItem(element, true);
            
            $("#sortable").sortable('refresh').trigger("update");
            clearForm();
        }

        
        
    });

    $("#btnCancel").click(function (e) {
       clearForm();
    });
})();