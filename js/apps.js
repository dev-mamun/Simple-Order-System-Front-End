/**
 * Created by Md.Abdullah Al Mamun.
 * Email: dev.mamun@gmail.com
 * Date: 4/29/2021
 * Time: 4:56 PM
 * Year: 2021
 */

class Apps {
    constructor() {
        this._helper = new Helper();
        //Initial Toastr
        toastr.options = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": true,
            "progressBar": true,
            "positionClass": "toast-top-right",
            "preventDuplicates": true,
            "onclick": null,
            "showDuration": "1000",
            "hideDuration": "3000",
            "timeOut": "6000",
            "extendedTimeOut": "2000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };
        if (this._helper.isLoggedIn()) {
            $("ul li:nth-child(3)").removeClass('d-none');
        } else {
            $("ul li:nth-child(2)").removeClass('d-none');
        }
    }

    items() {
        const url = this._helper._api + "/products";
        const result = this._helper.httpRequest(url);
        result.done(function (items) {
            var $html = "";
            $.each(items.data, function (key, val) {
                $html += '<div class="col-md-3">\n' +
                    '                    <div class="card mb-4 box-shadow">\n' +
                    '                        <img class="card-img-top img-thumbnail" src="' + val.image + '">\n' +
                    '                        <div class="card-body">\n' +
                    '                            <p class="card-text text-justify text-muted"><h5>' + val.name + '</h5>' + val.description + '.</p>\n' +
                    '                            <div class="d-flex justify-content-between align-items-center">\n' +
                    '                                <div class="btn-group">\n' +
                    '                                    <p><button data-id="' + val.product_id + '" data-price="' + val.price + '" class="btn btn-primary my-2 add-order">Add Order</button></p>\n' +
                    '                                </div>\n' +
                    '                            </div>\n' +
                    '                        </div>\n' +
                    '                    </div>\n' +
                    '                </div>';
            });
            $("#items").html($html);
        });
        this.addOrder();
    };

    addOrder() {
        const $this = this;
        $(document).on("click", ".add-order", function (e) {
            e.preventDefault();
            if ($this._helper.isLoggedIn()) {
                const $url = $this._helper._api + "/create/order";
                const $inputs = {};
                $inputs.product_id = $(this).data('id');
                $inputs.total = $(this).data('price');
                var $promises = $this._helper.httpRequest($url, "POST", $inputs, 'application/x-www-form-urlencoded');
                $promises.done(function (response) {
                    if (response.status) {
                        toastr.success('<strong class="text-left">' + response.msg + '</strong>', '<strong class="text-left">Order</strong>');
                    } else {
                        toastr.error('<strong class="text-left">' + response.msg + '</strong>', '<strong class="text-left">Order</strong>');
                    }
                });
            } else {
                toastr.error('<strong>Please Login.</strong>');
            }
        });
    };

    login() {
        var $this = this;
        $(document).on("click", ".btn-login", function (e) {
            e.preventDefault();
            var $loginFrm = $('.form-signin');
            var $parsley = $loginFrm.parsley().validate();
            var $url = $this._helper._api + "/login";
            if ($parsley) {
                var $promises = $this._helper.httpRequest($url, "POST", $loginFrm.serialize(), 'application/x-www-form-urlencoded');
                $promises.done(function (response) {
                    if (response.status) {
                        $this._helper.storage.saveStorage('session', 'user', response.data);
                        toastr.success('<strong class="text-left">' + response.msg + '</strong>', '<strong class="text-left">Login</strong>');
                        window.location.replace(response.data.redirect);
                    } else {
                        toastr.error('<strong class="text-left">' + response.msg + '</strong>', '<strong class="text-left">Login</strong>');
                    }
                });
            }
        });
    };

    orders() {
        if (this._helper.isLoggedIn()) {
            const url = this._helper._api + "/orders";
            const result = this._helper.httpRequest(url);
            result.done(function (response) {
                var $html = "";
                $.each(response.data, function (key, val) {
                    $html += ' <tr>\n' +
            '                    <th scope="row">'+(key+1)+'</th>\n' +
            '                    <td>'+val.name+'</td>\n' +
            '                    <td>'+val.sku+'</td>\n' +
            '                    <td>'+val.total+'</td>\n' +
            '                    <td>'+val.status+'</td>\n' +
            '                </tr>';
                });
                $(".table > tbody").html($html);
            });
        } else {
            window.location.replace("/login.html");
        }
    }
}