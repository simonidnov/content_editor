function content_editor(target, worker_target, api_request) {
    this.worker = worker_target;
    this.target = target;
    this.api_request = api_request;
    this.current = null;
    this.option_component = null;
    this.init = function () {
        this.setListeners();
    };
    this.setListeners = function () {
        $('.open_close').on('click', function () {
            if ($('.tool_bar').hasClass('opened')) {
                $('.tool_bar').removeClass('opened');
            } else {
                $('.tool_bar').addClass('opened');
            } 
        });
        $('.create_template').on('click', $.proxy(function (e) {
            var label = e.target.getAttribute("data-template"),
                temp;
            if (typeof label === "undefined") {
                console.log('you need to define a data-template on all .create_template class check list... ');
                return false;
            }
            temp = _.template($("#"+label).html());
            if(this.current === null){
                this.worker.append(temp({}));
            }else{
                $( temp({}) ).insertAfter( this.current );
            }
            this.check_listeners();
            this.option_component = _.template($('#option_template').html());
            this.toastr_check("do we need all that shit ?", ["oui", "non"]);
        }, this));
        $( "#content_editor" ).sortable();
    };
    this.check_listeners = function () {
        var textarea = document.getElementById('content_editor').querySelector('textarea');
        if(typeof textarea !== "undefined" && textarea !== null){
            textarea.addEventListener('keydown', autosize);
        }
        function autosize () {
            var el = this;
            // TODO : remove settimeout i dont know about but it doesnt work without on differnt browsers
            setTimeout(function(){
                el.style.cssText = 'height:auto; padding:0';
                // TODO : 40 egal padding top + bottom
                el.style.cssText = 'height:' + (el.scrollHeight+40) + 'px';
            },0);
        }
        $('.component').off('mouseenter').on('mouseenter', $.proxy(function (e){
            this.current = $(e.target).closest('.component');
            console.log("this.current ::: ", this.current);
            $('.tool_bar').css('top', this.current.position().top);
            this.set_options();
        }, this));
        $('.tool_bar').removeClass('opened');    
    }
    this.set_options = function () {
        console.log('set_options');
        $('.option_component').remove();
        this.current.append(this.option_component({}));
    };
    this.toastr_check = function (message, choices) {
        if(Array.isArray(choices)){
            if(this.toastr === "undefined"){
                this.toastr = _.template($('#editoaster_template').html());
            }
            if($('#content_editor').children().length > 3){
                console.log(this.toastr);
                //this.worker.append(this.toastr({"message":message, "choices":choices}));
            }
        }else{
            alert('fail choices need an array');
        }
    };
}