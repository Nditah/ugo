const apiUrl = "http://localhost:5000/api/v1/products";

// extending jquery
jQuery.each( [ "put", "delete" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
	  if ( jQuery.isFunction( data ) ) {
		type = type || callback;
		callback = data;
		data = undefined;
	  }
  
	  return jQuery.ajax({
		url: url,
		type: method,
		dataType: type,
		data: data,
		success: callback
	  });
	};
});

function notify(color, message) {
    const html = `<div class="alert alert-${color} alert-dismissible">
        <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
        ${message}
    </div>`;
    $(".feedback").html(html);
}

function preview() {
    const id = $("#productId").val();
    const name = $("#productName").val();
    const description = $("#productDescription").val();
    const price = $("#productPrice").val();
    const category = $("#productCategory").val();
    const color = $("#productColor").val();

    if (id.length > 2) { 
        $("#idSpan").hide();
    } else {
        $("#idSpan").show();
        notify(danger, "Please enter a value for product Id");
        return false; 
    } 
    if (name.length > 2) { 
        $("#nameSpan").hide();
    } else {
        notify(danger, "Please enter a value for product Name");
        $("#nameSpan").show();
        return false; 
    } 
    if (description.length > 2) { 
        $("#descriptionSpan").hide();
    } else {
        notify(danger, "Please enter a value for product Description"); 
        $("#descriptionSpan").show();
        return false; 
    } 
    if (price > 0) { 
        $("#priceSpan").hide();
    } else {
        notify(danger, "Please enter a value for product Price"); 
        $("#priceSpan").show();
        return false; 
    } 
    if (category) { 
        $("#categorySpan").hide();
    } else {
        notify(danger, "Please enter a value for product Category"); 
        $("#categorySpan").show();
        return false; 
    } 
    if (color) { 
        $("#colorSpan").hide();
    } else {
        notify(danger, "Please enter a value for product Color"); 
        $("#colorSpan").show();
        return false; 
    }                  
    $("#id").text(id);
    $("#name").text(name);
    $("#description").text(description);
    $("#price").text(price);
    $("#category").text(category);
    $("#color").text(color);
    // $("#image").text($("#imagePlaceholder").attr("src"));
    // $("#imagePreview").attr("src", $("#imagePlaceholder").val());
    $("#confirmModal").modal("show"); 
}

function addProduct() {
    const id = $("#productId").val();
    const name = $("#productName").val();
    const description = $("#productDescription").val();
    const price = $("#productPrice").val();
    const category = $("#productCategory").val();
    const color = $("#productColor").val();
    const image = $("#productImage").val();

	// Add record
	$.post(apiUrl, {
		id,
		name,
		description,
        price,
        category,
        color,
        image
	},
		function (data, status) {
			notify("success", "New record added!"); 
            $("#confirmModal").modal("hide");
            $("#addForm")[0].reset();
		});
}

function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function(e) {
        $("#imagePlaceholder").attr("src", e.target.result);
        $("#imagePreview").attr("src", e.target.result);
      }
      reader.readAsDataURL(input.files[0]);
    }
  }


// READ accounts
function readProduct() {
    $.get(apiUrl, {}, function (result, status) {
        if(result.success) {
            const productArray = result.data;
           // $("#product-content").html(result.data);
            $("#tblProduct tr").not(":first").not(":last").remove();
            let tblProduct = "";
            for(let i = 0; i < productArray.length; i++) {
                const id = productArray[i].id;
                tblProduct += "<tr><td>" + productArray[i].id + "</td>" +
                                "<td>" + productArray[i].name + "</td>" +
                                "<td>" + productArray[i].price + "</td>" + 
                                `<td><button class="btn btn-info btn-xs" onClick="getViewProduct('${id}');">` 
                                 + " View </button></td>" + 
                                 `<td><button class="btn btn-warning btn-xs" onClick="getUpdateProduct('${id}');">` 
                                  + " Edit </button></td>" + 
                                 `<td><button class="btn btn-danger btn-xs" onClick="getDeleteProduct('${id}');">` 
                                 + " Delete </button></td>" +
                            "</tr>";
                }					
            $("#tblProduct tr").first().after(tblProduct);
        } else { alert(result.message); }
       
       console.log(result);
     }); 
    // location.reload();
 }

 function getViewProduct(id) {
     $.get(`${apiUrl}/${id}`, {},
         function (result, status) {
            if(result.success) {
                const product = result.data;
                console.log("get activity #" + JSON.stringify(product));
                $("#viewId").val(product.id);
                $("#viewName").val(product.name);
                $("#viewPrice").val(product.price);
                $("#viewDescription").val(product.description);
                $("#viewColor").val(product.color);
                $("#viewImage").attr("src", product.image);
            }
         }
     );
     // Open modal popup
     $("#viewModal").modal("show");
 }

 function getUpdateProduct(id) {
    $("#updateId").val(id);
    $.get(`${apiUrl}/${id}`, {},
        function (result, status) {
           if(result.success) {
               const product = result.data;
               console.log("get activity #" + JSON.stringify(product));
               $("#updateId").text(product.id);
               $("#updateName").val(product.name);
               $("#updatePrice").val(product.price);
               $("#updateDescription").val(product.description);
               $("#updateColor").val(product.color);
               $("#updateImage").attr("src", product.image);
           }
        }
    );
    // Open modal popup
    $("#updateModal").modal("show");
}

function updateProduct() {
	// get values
	const id = $("#updateId").val();
	const name = $("#updateName").val();
	const description = $("#updateDescription").val();
	const price = $("#updatePrice").val();
	const color = $("#updateColor").val();
	const image = $("#updateImage").val();
	$("#updateModal").modal("hide");
	
	// Update the details by accounting to the server using ajax
	$.put(apiUrl, {
		id,
		name,
		description,
        price,
        category,
        color,
        image,
	},
		function (data, status) {
			notify("success", "Product update was successful!"); 
			readProduct();
		}
	);
}


function getDeleteProduct(id) {
    $("#deleteId").val(id);
    $("#deleteModal").modal("show");
}

function deleteProduct() { 
    const id = $("#deleteId").val();
    $.delete(`${apiUrl}/${id}`, {},
        function (result, status) {
           if(result.success) {
            $("#deleteModal").modal("hide");
            notify("success", "Product was deleted Successfully!"); 
            readProduct();
           }
        });   
}