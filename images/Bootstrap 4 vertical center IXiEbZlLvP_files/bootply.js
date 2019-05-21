var jsEditor;
var htmlEditor;
var cssEditor;
var snippets = {};

var rules = [
    {name:"container",regex:/container-fluid/g,rep:"container"},
    {name:"row",regex:/row-fluid/g,rep:"row"},
    {name:"span",regex:/span(?=[1-9|10|11|12])/g,rep:"col-md-"},
    {name:"offset",regex:/offset(?=[1-9|10|11|12])/g,rep:"col-lg-offset-"},
    {name:"btn",regex:/(?!class=\")btn(?=[\s\"][^\-|btn])/g,rep:"btn btn-default"},
    {name:"btn-mini",regex:/btn-mini/g,rep:"btn-xs"},
    {name:"btn-lg",regex:/btn-large/g,rep:"btn-lg"},
    {name:"btn-small",regex:/btn-small/g,rep:"btn-sm"},
    {name:"input",regex:/input-large/g,rep:"input-lg"},
    {name:"input",regex:/input-small/g,rep:"input-sm"},
    {name:"input",regex:/input-append/g,rep:"input-group"},
    {name:"input",regex:/input-prepend/g,rep:"input-group"},
    {name:"input",regex:/input-block-level/g,rep:"form-control"},
    {name:"add-on",regex:/add-on/g,rep:"input-group-addon"},
    {name:"label",regex:/(?!class=\")label(?=[\s\"][^\-|label])/g,rep:"label label-default"},
    {name:"hero",regex:/hero-unit/g,rep:"jumbotron"},
    {name:"nav list",regex:/nav-list/g,rep:""},
    {name:"affix",regex:/nav-fixed-sidebar/g,rep:"affix"},
    {name:"icons",regex:/(='\bicon-)/g,rep:"='glyphicon glyphicon-"},
    {name:"icons",regex:/(="\bicon-)/g,rep:"=\"glyphicon glyphicon-"},
    {name:"icons",regex:/(=\bicon-)/g,rep:"=glyphicon glyphicon-"},
    {name:"icons",regex:/\bclass+(\sicon-)/g,rep:"=\"glyphicon glyphicon-"},
    {name:"brand",regex:/\bbrand+/g,rep:"navbar-brand"},
    {name:"btn",regex:/(?!class=\")btn btn-navbar/g,rep:"navbar-toggle"},
    {name:"nav",regex:/nav-collapse/g,rep:"navbar-collapse"},
    {name:"toggle",regex:/nav-toggle/g,rep:"navbar-toggle"},
    {name:"util",regex:/(?!class=\")-phone/g,rep:"-sm"},
    {name:"util",regex:/(?!class=\")-tablet/g,rep:"-md"},
    {name:"util",regex:/(?!class=\")-desktop/g,rep:"-lg"}
    ];


var r = function(str){
    
    for (var i=0;i<rules.length;i++){
        str = str.replace(rules[i].regex,rules[i].rep);
    }
        
    /* structure changes require DOM manipulation */

    $('#ele').remove();
    var ele = $('<form id="ele" style="display:none;"></form>');
    ele.html(str);
    ele.appendTo("body");
    
    //navbar structure
    var nb = $('#ele').find('.navbar');
    if (typeof nb!="undefined"){
        nb.addClass('navbar-default');
        nb.find('.nav').addClass('navbar-nav'); // add the navbar-nav class
        nb.find('.btn').addClass('navbar-btn');
        var nb_inner = nb.find('.navbar-inner'); // remove the 2.x navbar-inner
        var h = nb_inner.html();
        if (typeof h!="undefined"){
            nb.html(h);
        }
        
        //wrap the brand and nav-toggle with nav-header
        var brand = nb.find(".navbar-brand");
        var togg = nb.find(".navbar-toggle");
        var navbarheader = $('<div class="navbar-header"></div>');
        
        if (typeof brand != "undefined" && typeof togg != "undefined") {
            brand.appendTo(navbarheader);
            togg.appendTo(navbarheader);
            navbarheader.prependTo(nb);
        }
    }
    
    //modal structure
    var md = $('#ele').find('.modal');
    if (typeof md!="undefined"){
        md.removeClass("hide");
        var mdia = $('<div class="modal-dialog"></div>');
        var mc = $('<div class="modal-content"></div>');
        mc.appendTo(mdia);
        $('#ele').find(".modal-header").appendTo(mc);
        $('#ele').find(".modal-body").appendTo(mc);
        $('#ele').find(".modal-footer").appendTo(mc);
        mdia.appendTo(md);
        //console.log("modal ele"+ele.html());
    }
    
    //icons
    var icos = $('#ele').find("[class^=icon]");
    
    //imgs
    var imgs = $('#ele img').addClass("img-responsive");
    
    // replace .thumbnails with .media-list
    str = $('#ele').html();
    
    $('#ele').remove();
    
    var regexOpt = {
        "indent_with_tabs": true,
        "preserve_newlines": true
    }
    
    return style_html(str.replace(/-\s->/g,"-->",regexOpt));
}

$(document).ready(function(){
    
    //$.getScript("/carbon.js"); // ads
    
    refreshTools();
    
    $('body').hide().fadeIn(1200);
    
    var hasChanged = false;
    var layoutOptions = {
            closable:                   false
		,	resizable:					true
		,	slidable:					true	
		,	livePaneResizing:			true
        ,   spacing_open:               2
		,	spacing_closed:             10
        ,   togglerLength_open:         40
        ,   south__closable:            true
        ,   south__spacing_closed:      23
        ,   south__togglerContent_closed: "<button class='btn btn-mini'>preview ^</button>"
        ,   south__togglerLength_closed:64
                
		,west__size:		242
        ,west__minSize:     220
        ,west__maxSize:     .26
        ,west__resizable:   false
        ,west__spacing_open: 1
        ,south__size:       .38
        ,south__maxSize:    .90
        ,south__minSize:    30
        ,south__spacing_open: 5
        ,center__minSize:   100
        ,center__childOptions: {
            closable:false,
            spacing_open:2,
			spacing_closed:10,
            livePaneResizing:true,
            center__onresize: function () {
                jsEditor.refresh();
                htmlEditor.refresh();
                cssEditor.refresh();
            },
            north__size:.23,
            north__minSize:50,
            north__childOptions:{
                spacing_open:2,
    		    spacing_closed:10,
                livePaneResizing:true,
                togglerLength_open:40,
                west__size:.55
            }
        },
        maskContents:true
        /*
        south__onresize: function () {
            htmlEditor.refresh();
            jsEditor.refresh();
            cssEditor.refresh();
        }
        */
    };
    
    var bpLayout = $('#wrap').layout(layoutOptions);
    
    $('#htm1').val($('#decoder').html().replace('<script src="/bootply.js"></script>',''));
   
    jsEditor = $('#js1').codemirror({
        mode: 'javascript',
        lineNumbers: true,
        viewportMargin: Infinity,
        autoResize: true
    });
    
    htmlEditor = $('#htm1').codemirror({
        mode: 'htmlmixed',
        lineNumbers: true,
        viewportMargin: Infinity,
        autoResize: true,
        onChange: function(cm){
            var htm = cm.getValue();
            $('#decoder').html(htm);
            if (htm&& htm.length>130000) {
                alert("Content too long!");
            }
        },
        onKeyEvent: function(cm){
            hasChanged = true;
        }
    });
    
    cssEditor = $('#css1').codemirror({
        mode: 'css',
        lineNumbers: true,
        viewportMargin: Infinity,
        autoResize: true
    });
    
    htmlEditor.getWrapperElement().addEventListener("paste", function(e) {
        var htm = htmlEditor.getValue();
        
        if (htm.indexOf("DOCTYPE")!=-1||htm.indexOf("<body")!=-1||htm.indexOf("<html")!=-1) {
            alert("Do not use DOCTYPE, HTML, BODY or HEAD tags here. Only the content of the BODY to be rendered.");
        }
    });
    
    htmlEditor.focus();
    
    $(window).bind('beforeunload', function(){
        if (hasChanged) {
            var htm = htmlEditor.getValue();
            if (htm && htm.length>5) {
                hasChanged = false;
                return 'You have unsaved changes..';
            }
        }
    });
    
    $('#btnSave').click(function(){
        
        hasChanged = false;
        var id = $('#loadId').val();
        var js = jsEditor.getValue();
        var ht = htmlEditor.getValue();
       
        //ht = style_html(ht).replace(/-\s->/g,"-->",{"indent_with_tabs": true,"preserve_newlines": true});
        
        var cs = cssEditor.getValue();
        var opts = $('#opts').serializeObject();
        var url;
        
        if (ht==="" && js==="") {
            alert("Nothing to save.");
            return false;
        }
        
        $('#btnSave').button('loading');
        
        var code = {};
        code._csrf = $('#token').val();
        code.ht = ht;
        code.js = js;
        code.cs = cs;
        code.private = opts.private;
        code.opts = opts;
        
        console.log("--"+code.private);
        
        if (typeof id === "undefined" || id.length===0) {
            url = "/paste";
        }
        else {
            url = "/paste?id="+id;
        }
        
        $.ajax({
            url: url,
            type: "post",
            data: code,
            success: function (data) {
                if (typeof data.error!="undefined") {
                    alert(data.error);
                    $('#btnSave').button("reset");
                } else if (data.pri===1) {
                    window.location = "/private/"+data.id;
                } else {
                    window.location = "/"+data.id;
                }
            },
            error: function (e) {
                console.log('error:'+e);
                $('#btnSave').button("reset");
            }
        });
    });
    
    $('#btnFork,#btnFork1').click(function(e){
        
        hasChanged = false;
        var id = $('#loadId').val();
        var js = jsEditor.getValue();
        var ht = htmlEditor.getValue();
        var cs = cssEditor.getValue();
        var opts = $('#opts').serializeObject();
        var url;
        var code = {};
        code._csrf = $('#token').val();
        code.ht = ht;
        code.js = js;
        code.cs = cs;
        code.opts = opts;
        
        //set fork
        code.opts.forkedId = id;
        
        $('#btnFork').button('loading');
        
        url = "/paste";
        
        $.ajax({
            url: url,
            type: "post",
            data: code,
            success: function (data) {
                if (typeof data.error!="undefined") {
                    //alert(data.error);
                    $('#btnFork').button("reset");
                } else if (data.pri==1) {
                    window.location = "/private/"+data.id;
                } else {
                    window.location = "/"+data.id;
                }
            },
            error: function (e) {console.log('error:'+e);$('#btnFork').button("reset");}
        });
    });
    
    $('#btnRun').click(function(e){

        if (bpLayout.state.south.isClosed) {
            bpLayout.open("south");
        };
        
        //bpLayout.sizePane('south','.40');
        
        $.getScript("/carbon.js"); // ads
        console.log("ca");
        $.getScript("/carbon2.js"); // ads
        
        // collapse open accordians
        /*
        $('.collapse.in').each(function (index) {
            $(this).collapse("hide");
        });
        */
        
        if ($("#settings").height()===0) {
            $("#settings").collapse("show");
        } 
         
        var js = jsEditor.getValue();
        var htm = htmlEditor.getValue();
        var css = cssEditor.getValue();
        var opts = $('#opts').serializeObject();
        
        var newForm = $('<form>', {
            'action': '/run',
            'method': 'POST',
            'target': 'view1'
            }).append($('<input>', {
                'name': 'htm',
                'value': htm,
                'type': 'hidden'
            })).append($('<input>', {
                'name': 'js',
                'value': js,
                'type': 'hidden'
            })).append($('<input>', {
                'name': 'css',
                'value': css,
                'type': 'hidden'
            })).append($('<input>', {
                'name': '_csrf',
                'value': $('#token').val(),
                'type': 'hidden'
            })).append($('<input>', {
                'name': 'opts',
                'value': JSON.stringify(opts),
                'type': 'hidden'
            }));
            
        newForm.hide();
        newForm.appendTo('body');
        newForm.submit();
        newForm.remove();
        
    });
    
    $('#btnFullscreen').click(function(e){

        var js = jsEditor.getValue();
        var htm = htmlEditor.getValue();
        var css = cssEditor.getValue();
        var opts = $('#opts').serializeObject();
        
        var newForm = $('<form>', {
            'action': '/run?ext=1',
            'method': 'POST',
            'target': 'full'
            }).append($('<input>', {
                'name': 'htm',
                'value': htm,
                'type': 'hidden'
            })).append($('<input>', {
                'name': 'js',
                'value': js,
                'type': 'hidden'
            })).append($('<input>', {
                'name': 'css',
                'value': css,
                'type': 'hidden'
            })).append($('<input>', {
                'name': '_csrf',
                'value': $('#token').val(),
                'type': 'hidden'
            })).append($('<input>', {
                'name': 'opts',
                'value': JSON.stringify(opts),
                'type': 'hidden'
            }));
            
        newForm.hide();
        newForm.appendTo('body');
        window.open('','full','width=1024,height=700,status=0');
        newForm.submit();
        newForm.remove();
        
        return false;
        
    });
    
    $('#btnPhone').click(function(e){

        var js = jsEditor.getValue();
        var htm = htmlEditor.getValue();
        var css = cssEditor.getValue();
        var opts = $('#opts').serializeObject();
        
        var newForm = $('<form>', {
            'action': '/run',
            'method': 'POST',
            'target': 'phone'
            }).append($('<input>', {
                'name': 'htm',
                'value': htm,
                'type': 'hidden'
            })).append($('<input>', {
                'name': 'js',
                'value': js,
                'type': 'hidden'
            })).append($('<input>', {
                'name': 'css',
                'value': css,
                'type': 'hidden'
            })).append($('<input>', {
                'name': '_csrf',
                'value': $('#token').val(),
                'type': 'hidden'
            })).append($('<input>', {
                'name': 'opts',
                'value': JSON.stringify(opts),
                'type': 'hidden'
            }));
            
        newForm.hide();
        newForm.appendTo('body');
        window.open('','phone','width=640,height=800,status=no,titlebar=no,menubar=no');
        newForm.submit();
        newForm.remove();
        
    });
    
    var hookupElement = function(ele,accept){
        var dropCanvas = $('#dropFrame').contents().find('#dropCanvas');
        ele.draggable({snap:true,helper:"clone",cursor:"grab",snapTolerance:10,cancel:false,distance:10,iframeFix:true,cursorAt:{left:'2',top:'13'}}).droppable(dropHandler(accept)).addClass("dropped");
             
        // determine what's editable
        var im = ele.find('*:not(:has("*"))');
        if (im.size()===0){
            ele.addClass("editable");
        }
        else {
            im.addClass("editable");
        }
        
        var editable = dropCanvas.find('.editable');
        editable.on('mousedown',clickHandler).on('dblclick',dblclickHandler).on('blur',blurHandler);
    };
    
    var toggleCodeVisualHandler = function(e){
        
        var uname = $('#lblUsername').text();
        if (typeof uname==="undefined" || uname==="undefined" || uname.length<2){
            prependAlert("#spacer","Please login to use the visual builder.");
            $('#navLogin').trigger('click');
            return false;
        };
        
        var decoderHtml = $('#decoder').html();
        if (decoderHtml==="undefined" || decoderHtml.length<1){
            $('#pickStarterModal').modal('show');
            return false;
        };
        
        var dropCanvas = $('#dropFrame').contents().find('#dropCanvas');
        dropCanvas.on('click',function(){
            $("#context-menu").dialog('close');
            $("[contenteditable]").blur();
        });

        if (typeof dropCanvas.html() === "undefined") {
            dropCanvas = $('#dropFrame').contents().find('#previewCanvas');            
        }

        if ($(this).text().indexOf("Visual")!=-1){ // switch to drag and drop
        
            $(document).attr('title', 'Bootstrap Visual Builder - Bootply');
            var opts = $('#opts').serializeObject();
            
            $('#btnSave').hide();
            $('#btnRun').hide();
            $('#btnFork').hide();
            $('#btnSwitch').show();
            
            bpLayout.destroy();
            $('.ui-layout-west').hide();
            $('.ui-layout-center').hide();
            $('.ui-layout-south').hide();
            
            // set up outermost container
            dropCanvas.html($('#decoder').html());
            
            var js = jsEditor.getValue();
            var cs = cssEditor.getValue();
            
            $('#dropFrame').contents().find('#bsCss').html(cs);
            $('#dropFrame').contents().find('#bsJs').html(js);
            
            $('#dropFrame').contents().find('#bsLink').attr("href","/cdn/bootstrap/css/"+opts.bootstrapVersion);
            
            dropCanvas.find('*').each(function(idx,val){
                var ele = $(this);
                var tag = ele.get(0).tagName.toLowerCase();
                var foundEle = false;
                                
                if (typeof ele.attr("class")!="undefined") {
                    var classNames = ele.attr("class").split(" ");
                    for (var i=0;i<=classNames.length;i++){
                        if (typeof objs[classNames[i]]!="undefined") {
                            /*console.log("assiging"+classNames[i]);*/
                            ele.attr("data",classNames[i]);
                            hookupElement(ele,objs[classNames[i]].accept);
                            
                            i=classNames.length;
                            foundEle = true;
                            return;
                        }
                    }
                }
                
                if (typeof objs[tag]!="undefined" && foundEle===false) {
                    /*console.log("hookup:"+tag);*/
                    ele.attr("data",tag);
                    hookupElement(ele,objs[tag].accept);
                }
                
                // determine what's editable
                var im = ele.find('*:not(:has("*"))');
                if (im.size()===0){
                    ele.addClass("editable");
                }
                else {
                    im.addClass("editable");
                }
                var editable = dropCanvas.find('.editable');
                editable.on('mousedown',clickHandler).on('dblclick',dblclickHandler).on('blur',blurHandler);
            });
            
             // hook-up context menu
            var dropped = dropCanvas.find('.dropped');
            dropped.contextmenu(contextHandler).mouseover(mouseoverHandler).mouseout(mouseoutHandler);
            //dropCanvas.droppable(dropHandler("[data=row],[data=navbar],[data=container]"));
            dropCanvas.droppable(dropHandler("[data]"));
            /*
            dropCanvas.click(function(){
                $("#context-menu").dialog('close');
                $("[contenteditable]").blur();
            });
            */
            
            $('#dropster').show();
            
            $(this).html("<i class='icon-code'></i> Code View");
        }
        else { // switch to code editor
            
            $(document).attr('title', 'Bootstrap CSS / JS / HTML Editor - Bootply');
            $('#btnSave').fadeIn(500);
            $('#btnRun').fadeIn(500);
            $('#btnSwitch').hide();
            $('#dropster').hide();
            
            dropCanvas.find('.ui-draggable').draggable('destroy');
            dropCanvas.find('.ui-droppable').droppable('destroy');
            dropCanvas.find('.dropped').removeAttr('data').removeClass('dropped');
            dropCanvas.find('.inno').removeAttr('data').removeClass('inno');
            dropCanvas.find('.droppedSelected').removeClass('droppedSelected');
            dropCanvas.find('.editable').removeClass('editable');
            $('[contenteditable]').removeAttr('contenteditable');
                        
            bpLayout = $('#wrap').layout(layoutOptions);
            
            var options = {
                "indent_with_tabs": true,
                "preserve_newlines": true
            }
            
            // replace is hack for jsbeautifier (style_html) bug with comment blocks
            htmlEditor.setValue(style_html(dropCanvas.html()).replace(/-\s->/g,"-->",options));
            
            $('#btnRun').trigger('click');
            
            $(this).html("Visual <i class='icon-eye-open'></i>");
        }
    };
    
    $('#btnDrop').click(toggleCodeVisualHandler);
    
    var state = [];
    $('#btnSwitch').click(function(){
      
        //var dropCanvas = $('#dropFrame').contents().find('#dropCanvas');
        var btnState = $(this).text();
        
        if (btnState=="Drag + Drop") {
            toggleDragAndDrop("on");
            $(this).text('Preview');
        }
        else {
            // save state and preview
            toggleDragAndDrop("off");
            $(this).text('Drag + Drop');
        }
    });

    var toggleDragAndDrop = function(toggleState){
        
        var dropCanvas = $('#dropFrame').contents().find('#dropCanvas');
        if (toggleState==="on") {
            dropCanvas = $('#dropFrame').contents().find('#previewCanvas');
        
            // restore state and enable editing
            dropCanvas.find('.inno').each(function(index, value) {
              var ele = $(value);
              console.log("restoring..");
              if (state[index].drag && typeof state[index].drag.options!="undefined"){
                ele.draggable(state[index].drag.options);
              }
              if (state[index].drop && typeof state[index].drop.options!="undefined") {
                ele.droppable(state[index].drop.options).contextmenu(contextHandler).mouseover(mouseoverHandler).mouseout(mouseoutHandler);
              }
            });                
            
            dropCanvas.find('.inno').addClass('dropped');
            dropCanvas.find('.inno').removeClass('inno');
            dropCanvas.find('.editable').addClass('editable');
            dropCanvas.attr("id","dropCanvas");
        }
        else { // turn off and preview
            dropCanvas.find('.dropped').each(function(index, value) {
                var ele = $(value);
                state.push({drag:ele.data("ui-draggable"),drop:ele.data("ui-droppable")});
                //console.log("saving.."+ele.data("ui-draggable"));
            });
            dropCanvas.find('.ui-draggable').draggable('destroy');
            dropCanvas.find('.ui-droppable').droppable('destroy');
            dropCanvas.find('.dropped').addClass('inno');
            dropCanvas.find('.dropped').removeClass('dropped').unbind('mouseover').unbind('mouseout').unbind('contextmenu');
            dropCanvas.find('.editable').removeClass('editable');
            dropCanvas.find('[contenteditable]').removeAttr('contenteditable');
            dropCanvas.attr("id","previewCanvas");
        }
    };
    
    $('#btnSettings').click(function(e){
        $('#btnSave').trigger('click');
        return false;
    });
    
    $('#btnSettings').mouseenter(function(e){
        $('#btnSave').css({'color':'#fff'});
    }).mouseleave(function(e){
        $('#btnSave').css({'color':''});
    });
    
    $('.pickTag').click(pickListClick);
    $('#bootstrapVersion').selectpicker({style:'btn-mini'});
    $('#jqueryVersion').selectpicker({style:'btn-mini'});
    $('#includes').selectpicker({style:'btn-mini'});
    $('#includes').change(function(){
        var selectedOpts = $('#includes').val();
        // console.log(JSON.stringify(selectedOpts));
        $("#includes option").each(function() {
            $('#'+this.value).val('0');             // set all to 0
        });
        if (selectedOpts) {
            for(var i=0;i<selectedOpts.length;i++){
                $('#'+selectedOpts[i]).val('1');    // set selected to 1
            }
        }
        return false;
    });
    $('#themes').selectpicker({style:'btn-mini'});
    $('#themes').change(function(){
        var selectedOpt = $('#themes').val();
        $("#themes option").each(function() {
            $('#'+this.value).val('0'); // set all to 0
        });
        $('#'+selectedOpt).val('1'); // set selected to 1
        return false;
    });
    $('#bootstrapVersion').change(function(){
        refreshTools();
        return false;
    });
    $('.layout').click(function(e){
        var id = $(this).attr("data");
        var cont = true;
        
        /* check we dont overwrite editors*/
        if (htmlEditor && htmlEditor.getValue().length>1){
            cont = confirm("This will overwrite any existing content in the editor. Continue?")
        }
        
        if (cont && typeof id!="undefined" && id.length>2){
            $("#settings").collapse("show");
            $.ajax({
                url: '/load/'+id,
                type: "get",
                success: function (data) {
                    
                    jsEditor.setValue(data.js);
                    htmlEditor.setValue(data.htm);
                    cssEditor.setValue(data.css);
                    var opts = data.opts;
                    //$('#name').val(opts.name);
                    $('#bootstrapVersion').val(opts.bootstrapVersion);
                    $('#bootstrapVersion').change();
                    
                    var selectedOpts = ["angular"];
                    if (selectedOpts) {
                        for(var i=0;i<selectedOpts.length;i++){
                            $('#'+selectedOpts[i]).val('1');    // set selected to 1
                        }
                    }
                    
                    $('#btnRun').trigger('click');
                    htmlEditor.focus();
                },
                error: function (e) {console.log('error:'+e)}
            });
        }
        else {
            $('#decoder').html('<div class="container"></div>');
            $('#btnDrop').trigger('click');
        }
    });
    
    $('#btnConvert').click(function(e){
        var src = htmlEditor.getValue();
        if (src.indexOf("navbar-header")!=-1||src.indexOf("-col-")!=-1||src.indexOf("glyphicon")!=-1) {
            alert("This HTML has already been converted to Bootstrap v 3.0");
            return;
        }
        else {
            
            var res = r(src);
            htmlEditor.setValue(res);        
        }
    });

    $('#btnDownload').click(function(e){
    
        //bpLayout.sizePane('south','.40');
        
        //$.getScript("/carbon.js"); // ads
        
        // collapse open accordians
        /*
        $('.collapse.in').each(function (index) {
            $(this).collapse("hide");
        });
        */
        
        if ($("#settings").height()===0) {
            $("#settings").collapse("show");
        }
        
        var js = jsEditor.getValue();
        var htm = htmlEditor.getValue();
        var css = cssEditor.getValue();
        var opts = $('#opts').serializeObject();
        
        var newForm = $('<form>', {
            'action': '/download',
            'method': 'POST',
            'target': 'view1'
            }).append($('<input>', {
                'name': 'htm',
                'value': htm,
                'type': 'hidden'
            })).append($('<input>', {
                'name': 'js',
                'value': js,
                'type': 'hidden'
            })).append($('<input>', {
                'name': 'css',
                'value': css,
                'type': 'hidden'
            })).append($('<input>', {
                'name': '_csrf',
                'value': $('#token').val(),
                'type': 'hidden'
            })).append($('<input>', {
                'name': 'opts',
                'value': JSON.stringify(opts),
                'type': 'hidden'
            }));
            
        newForm.hide();
        newForm.appendTo('body');
        newForm.submit();
        newForm.remove();
        
    });
       
            
            
    // dropster ------------------------------------------
    (function($) {
        $.fn.setUpContextMenu = function() {
            $(this).dialog({
                autoOpen: false,
                modal: false,
                resizable: false,
                width: 'auto',
                height: 'auto',
                minHeight: 'auto',
                minWidth: 'auto'
            });
    
            return $(this);
        };
    
        $.fn.openContextMenu = function(jsEvent,eleType) {
            var menu = $(this);
       
            menu.css('padding', 0);
            menu.dialog('option', 'position', [jsEvent.clientX, jsEvent.clientY]);
            menu.unbind('dialogopen');
            menu.bind('dialogopen', function(event, ui) {
                $('.ui-dialog-titlebar').hide();
                //$('.ui-widget-overlay').unbind('click');
                $('.ui-widget-overlay').css('opacity', 0);
                $('.ui-widget-overlay').click(function() {
                    menu.dialog('close');
                });
            });
            menu.find(".context-heading").html(eleType);
            menu.dialog('open');    
    
            return false;
        };
    })(jQuery); 
    
    $('#context-menu').setUpContextMenu();
    
    $('.item').draggable({
        helper:"clone",
        snap:true,
        snapTolerance:10,
        distance:10,
        cancel:false,
        cursor:"grab",
        iframeFix:true,
        revert: function(droppableObj)
          {
            if(droppableObj===false)
            {
                if ($('#btnSwitch').text()==="Drag + Drop") {
                    if (confirm('You are in "Preview" mode. Would you like to switch to "Drag and Drop" mode?')){
                        $('#btnSwitch').trigger('click');
                    };
                }
                else {
                    alert('This element can only be dropped onto a container. Try adding a container, row or span first.');
                }
                return true;
            }
            else
            {
            return false;
            }
        },
        start: function (event, ui) {
            var myclone = $(ui.helper).clone();
            $(ui.helper).remove();
            myclone.css("left", event.clientX-6);
            myclone.css("top", event.clientY-6);
            myclone.css("z-index","1200");
            myclone.addClass("helper");
            myclone.appendTo("#topMenu");
        },
        drag: function (event, ui) {
            var myclone = $('.helper');
            myclone.css("left", event.clientX-6);
            myclone.css("top", event.clientY-6);
        },
        stop: function (event, ui) {
            $('.helper').remove();
        },
        cursorAt:{left:'10',top:'10'}
    });

    $('#optSave').click(function(e) {
        var originalElement = $("#context-menu").data('originalElement');
      
  	    originalElement.attr("id",$("#context-menu-id").val());
 	    originalElement.attr("style",$("#context-menu-style").val());
  	    originalElement.addClass($("#context-menu-class").val());
  
        // reset
        $("#context-menu-id").val();
        $("#context-menu-style").val();  
        $("#context-menu-class").val();  
  	    $("#context-menu").dialog('close');
    });
    
    $('#optDel').click(function(e) {
    	var originalElement = $("#context-menu").data('originalElement');
        originalElement.remove();
      	$("#context-menu").dialog('close');
    });
    
    $('#optCopy').click(function(e) {
        var originalElement = $("#context-menu").data('originalElement');
        var cl = originalElement.clone(true);
        cl.insertAfter(originalElement);
      	$("#context-menu").dialog('close');
    });
    
    var objs2 = {
      "row":{"ht":"<div class=\"row-fluid\"></div>","accept":"[data]"},
      "container":{"ht":"<div class=\"container\"></div>","accept":"[data]"},
      "span2":{"ht":"<div class=\"span2\"></div>","accept":"[data*=btn],[data*=small],[data*=span],[data*=para],[data*=link],[data^=h],[data^=i],[data=well],[data=lorem],[data*=label],[data*=badge]"},
      "span3":{"ht":"<div class=\"span3\"></div>"},
      "span4":{"ht":"<div class=\"span4\"></div>","accept":"[data]"},
      "span6":{"ht":"<div class=\"span6\"></div>","accept":"[data]"},
      "span9":{"ht":"<div class=\"span9\"></div>","accept":"[data]"},
      "span10":{"ht":"<div class=\"span10\"></div>","accept":"[data]"},
      "span12":{"ht":"<div class=\"span12\"></div>","accept":"[data]"},
      "navbar":{"ht":"<div class=\"navbar navbar-static\"><div class=\"navbar-inner\"><div class=\"container\"><a class=\"brand\" href=\"#\">Brand</a><ul class=\"nav\"><li class=\"active\"><a href=\"#\">Home</a></li><li><a href=\"#\">Link</a></li><li><a href=\"#\">Link</a></li><li class=\"divider-vertical\"></li><li><a href=\"#\">More</a></li><li><a href=\"#\">Options</a></li></ul></div></div></div>","dropClass":".navbar-inner","accept":"[data*=btn],[data*=dropdown],[data*=link],[data^=i]"},
      "btn":{"ht":"<button class=\"btn\">Button</button>","accept":".none"},
      "btn_group":{"ht":"<div class=\"btn-group\"><button class=\"btn\">Left</button><button class=\"btn\">Middle</button><button class=\"btn\">Right</button></div>","accept":".none"},
      "well":{"ht":"<div class=\"well\">well</div>","accept":"[data*=span],[data*=btn],[data*=input],[data*=small],[data^=i],[data=link],[data*=para],[data=lorem]"},
      "hero":{"ht":"<div class=\"hero-unit\"><h1>Hello World</h1><span>I'm a hero unit!</span></div>","accept":"[data*=span],[data*=btn],[data*=input],[data*=small],[data^=i],[data=link],[data*=para]"},
      "label":{"ht":"<span class=\"label\">label</span>","accept":".none"},
      "badge":{"ht":"<span class=\"badge\">badge</span>","accept":".none"},
      "form":{"ht":"<form class=\"form form-horizontal\"><div class=\"control-group\"><label class=\"control-label\" for=\"inputEmail\">Email</label><div class=\"controls\"><input type=\"text\" id=\"inputEmail\" placeholder=\"Email\"></div></div><div class=\"control-group\"><label class=\"control-label\" for=\"inputPassword\">Password</label><div class=\"controls\"><input type=\"password\" id=\"inputPassword\" placeholder=\"Password\"></div></div><div class=\"control-group\"><div class=\"controls\"><label class=\"checkbox\"><input type=\"checkbox\"> Remember me</label><button type=\"submit\" class=\"btn\">Sign in</button></div></div></form>","accept":"[data*=input],[data*=btn]"},
      "image":{"ht":"<img src=\"http://placehold.it/150x100\">","accept":".none"},
      "big_image":{"ht":"<img src=\"http://placehold.it/800x600\">","accept":".none"},
      "input_text":{"ht":"<input type=\"text\" placeholder=\"text input\">","accept":".none"},
      "input_select":{"ht":"<select><option>One</option><option>Two</option><option>Three</option></select>","accept":".none"},
      "input_textarea":{"ht":"<textarea></textarea>","accept":".none"},
      "input_checkbox":{"ht":"<label class=\"checkbox\"><input type=\"checkbox\"> Check me </label>","accept":"[data^=i]"},
      "hr":{"ht":"<hr>","accept":".none"},
      "grid_row":{"ht":"<div class=\"row-fluid\"><div class=\"span4\">1</div><div class=\"span4\">2</div><div class=\"span4\">3</div></div>","accept":"[data*=span],[data*=btn],[data*=input],[data*=small],[data*=span],[data^=i],[data=link],[data*=para],[data=well]"},
      "h1":{"ht":"<h1>Heading 1</h1>","accept":"[data*=small],[data^=i],[data=link],[data*=span],[data*=label],[data*=badge]"},
      "h2":{"ht":"<h2>Heading 2</h2>","accept":"[data*=small],[data^=i],[data=link],[data*=span],[data*=label],[data*=badge]"},
      "h3":{"ht":"<h3>Heading 3</h3>","accept":"[data*=small],[data^=i],[data=link],[data*=span],[data*=label],[data*=badge]"},
      "h4":{"ht":"<h4>Heading 4</h4>","accept":"[data*=small],[data^=i],[data=link],[data*=span],[data*=label],[data*=badge]"},
      "h5":{"ht":"<h5>Heading 5</h5>","accept":"[data^=i],[data=link],[data*=label],[data*=badge]"},
      "h6":{"ht":"<h6>Heading 6</h6>","accept":"[data^=i],[data=link],[data*=label],[data*=badge]"},
      "icon":{"ht":"<i class=\"icon-cog\">","accept":".none"},
      "para":{"ht":"<p>content here</p>","accept":"[data*=small],[data^=i],[data=link],[data=lorem],[data*=span]"},
      "link":{"ht":"<a href=\"#\">Link</a>","accept":"[data*=small],[data^=i],[data*=span]"},
      "small":{"ht":"<small>small text</small>","accept":"[data=icon]"},
      "table":{"ht":"<table class=\"table table-bordered\"><tr><th>One</th><th>Two</th></tr><tr><td>cell</td><td>cell</td></tr></table>","accept":"[data*=btn],[data*=input],[data*=small],[data*=link],[data=lorem],[data*=span]"},
      "btn_dropdown":{"ht":"<div class=\"btn-group\"><a class=\"btn dropdown-toggle\" data-toggle=\"dropdown\" href=\"#\">Dropdown<span class=\"caret\"></span></a><ul class=\"dropdown-menu\"><li><a href=\"#\">Choice1</a></li><li><a href=\"#\">Choice2</a></li><li><a href=\"#\">Choice3</a></li><li class=\"divider\"></li><li><a href=\"#\">Choice..</a></li></ul></div>","accept":"[data=icon]"},
      "media":{"ht":"<div class=\"media\"><a class=\"pull-left\" href=\"#\"><img class=\"media-object\" src=\"//placehold.it/64\"></a><div class=\"media-body\"><h4 class=\"media-heading\">Media heading</h4><p>This is the content for your media.</p></div></div>","accept":"[data^=i]"},
      "lorem":{"ht":"<span>Lorem ipsum sed ut perspiciatis unde em accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia cor magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</span>","accept":".none"},
      "img":{"ht":"<img src=\"\">","accept":".none"},
      "input":{"ht":"<input type=text>","accept":".none"},
      "select":{"ht":"","accept":".none"},
      "textarea":{"ht":"","accept":".none"},
      "button":{"ht":"","accept":"[data^=i]"},
      "div":{"ht":"","accept":"[data]"},
      "span":{"ht":"","accept":"[data=link],[data=lorem],[data^=i]"},
      "p":{"ht":"","accept":"[data*=small],[data^=i],[data=link],[data=lorem],[data*=span]"},
      "a":{"ht":"","accept":"[data*=small],[data^=i],[data*=span]"},
      "ul":{"ht":"","accept":"[data^=i]"},
      "ol":{"ht":"","accept":"[data^=i]"}
    };
    
    var objs = {
      "row":{"ht":"<div class=\"row\"></div>","accept":"[data]"},
      "container":{"ht":"<div class=\"container\"></div>","accept":"[data]"},
      "col1":{"ht":"<div class=\"col-md-1\">text</div>","accept":"[data*=btn],[data*=small],[data*=col],[data*=para],[data*=link],[data^=h],[data^=i],[data=lorem],[data*=label],[data*=badge]"},
      "col2":{"ht":"<div class=\"col-md-2\">text</div>","accept":"[data*=btn],[data*=small],[data*=col],[data*=para],[data*=link],[data^=h],[data^=i],[data=well],[data=lorem],[data*=label],[data*=badge]"},
      "col3":{"ht":"<div class=\"col-md-3\">text</div>","accept":"[data]"},
      "col4":{"ht":"<div class=\"col-md-4\">text</div>","accept":"[data]"},
      "col5":{"ht":"<div class=\"col-md-5\">text</div>","accept":"[data]"},
      "col6":{"ht":"<div class=\"col-md-6\">text</div>","accept":"[data]"},
      "col7":{"ht":"<div class=\"col-md-7\">text</div>","accept":"[data]"},
      "col8":{"ht":"<div class=\"col-md-8\">text</div>","accept":"[data]"},
      "col9":{"ht":"<div class=\"col-md-9\">text</div>","accept":"[data]"},
      "col10":{"ht":"<div class=\"col-md-10\">text</div>","accept":"[data]"},
      "col11":{"ht":"<div class=\"col-md-11\">text</div>","accept":"[data]"},
      "col12":{"ht":"<div class=\"col-md-12\">text</div>","accept":"[data]"},
      "navbar":{"ht":"<div class=\"navbar navbar-default navbar-static\"><div class=\"navbar-header\"><a class=\"navbar-brand\" href=\"#\">Brand</a></div><ul class=\"nav navbar-nav\"><li class=\"active\"><a href=\"#\">Home</a></li><li><a href=\"#\">Link</a></li><li><a href=\"#\">Link</a></li><li class=\"divider-vertical\"></li><li><a href=\"#\">More</a></li><li><a href=\"#\">Options</a></li></ul></div>","dropClass":".navbar-inner","accept":"[data*=btn],[data*=dropdown],[data*=link],[data^=i]"},
      "btn":{"ht":"<button class=\"btn btn-default\">Button</button>","accept":".none"},
      "btn_group":{"ht":"<div class=\"btn-group\"><button class=\"btn\">Left</button><button class=\"btn\">Middle</button><button class=\"btn\">Right</button></div>","accept":".none"},
      "well":{"ht":"<div class=\"well\">well</div>","accept":"[data*=col],[data*=btn],[data*=input],[data*=small],[data^=i],[data=link],[data*=para],[data=lorem]"},
      "hero":{"ht":"<div class=\"jumbotron\"><h1>Hello World</h1><span>I'm a jumbotron unit!</span></div>","accept":"[data*=col],[data*=btn],[data*=input],[data*=small],[data^=i],[data=link],[data*=para]"},
      "label":{"ht":"<span class=\"label label-default\">label</span>","accept":".none"},
      "badge":{"ht":"<span class=\"badge badge-default\">badge</span>","accept":".none"},
      "form":{"ht":"<form class=\"form form-horizontal\"><div class=\"control-group\"><label class=\"control-label\">Email</label><div class=\"controls\"><input type=\"text\" id=\"inputEmail\" placeholder=\"Email\" class=\"form-control\"></div></div><div class=\"control-group\"><label class=\"control-label\">Password</label><div class=\"controls\"><input type=\"password\" id=\"inputPassword\" placeholder=\"Password\" class=\"form-control\"></div></div><div class=\"control-group\"><div class=\"controls\"><label class=\"checkbox\"><input type=\"checkbox\"> Remember me</label><button type=\"submit\" class=\"btn\">Sign in</button></div></div></form>","accept":"[data*=input],[data*=btn]"},
      "image":{"ht":"<img src=\"http://placehold.it/150x100\" class=\"img-responsive\">","accept":".none"},
      "big_image":{"ht":"<img src=\"http://placehold.it/800x600\" class=\"img-responsive\">","accept":".none"},
      "input_text":{"ht":"<input type=\"text\" placeholder=\"text input\" class=\"form-control\">","accept":".none"},
      "input_select":{"ht":"<select class=\"form-control\"><option>One</option><option>Two</option><option>Three</option></select>","accept":".none"},
      "input_textarea":{"ht":"<textarea class=\"form-control\"></textarea>","accept":".none"},
      "input_checkbox":{"ht":"<label class=\"checkbox\"><input type=\"checkbox\" class=\"form-control\"> Check me </label>","accept":"[data^=i]"},
      "hr":{"ht":"<hr>","accept":".none"},
      "grid_row":{"ht":"<div class=\"row\"><div class=\"col-md-4\">1</div><div class=\"col-md-4\">2</div><div class=\"col-md-4\">3</div></div>","accept":"[data*=col],[data*=btn],[data*=input],[data*=small],[data*=span],[data^=i],[data=link],[data*=para],[data=well]"},
      "h1":{"ht":"<h1>Heading 1</h1>","accept":"[data*=small],[data^=i],[data=link],[data*=col],[data*=label],[data*=badge]"},
      "h2":{"ht":"<h2>Heading 2</h2>","accept":"[data*=small],[data^=i],[data=link],[data*=col],[data*=label],[data*=badge]"},
      "h3":{"ht":"<h3>Heading 3</h3>","accept":"[data*=small],[data^=i],[data=link],[data*=col],[data*=label],[data*=badge]"},
      "h4":{"ht":"<h4>Heading 4</h4>","accept":"[data*=small],[data^=i],[data=link],[data*=col],[data*=label],[data*=badge]"},
      "h5":{"ht":"<h5>Heading 5</h5>","accept":"[data^=i],[data=link],[data*=label],[data*=badge]"},
      "h6":{"ht":"<h6>Heading 6</h6>","accept":"[data^=i],[data=link],[data*=label],[data*=badge]"},
      "icon":{"ht":"<i class=\"icon-cog\">","accept":".none"},
      "para":{"ht":"<p>content here</p>","accept":"[data*=small],[data^=i],[data=link],[data=lorem],[data*=span]"},
      "link":{"ht":"<a href=\"#\">Link</a>","accept":"[data*=small],[data^=i],[data*=span]"},
      "small":{"ht":"<small>small text</small>","accept":"[data=icon]"},
      "table":{"ht":"<table class=\"table table-bordered\"><tr><th>One</th><th>Two</th></tr><tr><td>cell</td><td>cell</td></tr></table>","accept":"[data*=btn],[data*=input],[data*=small],[data*=link],[data=lorem],[data*=span]"},
      "btn_dropdown":{"ht":"<div class=\"btn-group\"><a class=\"btn dropdown-toggle\" data-toggle=\"dropdown\" href=\"#\">Dropdown<span class=\"caret\"></span></a><ul class=\"dropdown-menu\"><li><a href=\"#\">Choice1</a></li><li><a href=\"#\">Choice2</a></li><li><a href=\"#\">Choice3</a></li><li class=\"divider\"></li><li><a href=\"#\">Choice..</a></li></ul></div>","accept":"[data=icon]"},
      "media":{"ht":"<div class=\"media\"><a class=\"pull-left\" href=\"#\"><img class=\"media-object\" src=\"//placehold.it/64\"></a><div class=\"media-body\"><h4 class=\"media-heading\">Media heading</h4><p>This is the content for your media.</p></div></div>","accept":"[data^=i]"},
      "lorem":{"ht":"<span>Lorem ipsum sed ut perspiciatis unde em accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia cor magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</span>","accept":".none"},
      "img":{"ht":"<img src=\"\">","accept":".none"},
      "input":{"ht":"<input type=text>","accept":".none"},
      "select":{"ht":"","accept":".none"},
      "textarea":{"ht":"","accept":".none"},
      "button":{"ht":"","accept":"[data^=i]"},
      "div":{"ht":"","accept":"[data]"},
      "span":{"ht":"","accept":"[data=link],[data=lorem],[data^=i]"},
      "p":{"ht":"","accept":"[data*=small],[data^=i],[data=link],[data=lorem],[data*=span]"},
      "a":{"ht":"","accept":"[data*=small],[data^=i],[data*=span]"},
      "ul":{"ht":"","accept":"[data^=i]"},
      "ol":{"ht":"","accept":"[data^=i]"}
    };
    
    var unselect = function(sel) {
    console.log("unselected..");
      $(sel).removeClass("droppedSelected");
    };
    
    var mouseoverHandler = function(e) {
        $(this).addClass('droppedHover');
        $('#hoverStatus').text($(this).attr("data"));
        e.stopPropagation();
    };
   
    var mouseoutHandler = function(e){
        $(this).removeClass('droppedHover');
        $('#hoverStatus').text('');
    };
                
    var contextHandler = function(e) {
        //$(e.target).parent('.dropped');
        e.preventDefault();
        $('#context-menu').data('originalElement',$(this));
        $('#context-menu').openContextMenu(e,$(this).attr("data"));
        e.stopPropagation();
        return false;
    };

    var DELAY = 400,
    clicks = 0,
    timer = null;
    
    var clickHandler = function(e) {
        
        e.preventDefault();
        clicks++;  //count clicks
        var clicked = $(this);
        var dropCanvas = $('#dropFrame').contents().find('#dropCanvas');
      
        if(clicks === 1) {
        
            timer = setTimeout(function() {
                console.log('Single Click'); //perform single-click action
                clicks = 0;  //after action performed, reset counter
                
                //$("#context-menu").dialog('close');
                dropCanvas.find("[contenteditable]").blur();
            
            }, DELAY); // end timer
          
        } else {
          
            clearTimeout(timer);  //prevent single-click action
            
            console.log('Dbl Click');
            
            //dbl click
            if (clicked.hasClass('ui-draggable-dragging') ) {
                return;
            }

            if (clicked.is("droppable")) {
                clicked.droppable("option","disabled",true );
                clicked.draggable("option","disabled",true );
            }
            clicked.prop('contenteditable',true).focus();
            
            clicks = 0;  //after action performed, reset counter
           
        }; // end if
        
        e.stopPropagation();
    };
    
    var dblclickHandler = function(e){
        e.preventDefault();
    };
    
    var blurHandler = function(e){
        $(this).prop('contenteditable',false);
        if ($(this).data("droppable")) {
            $(this).droppable("option","disabled",false);
            $(this).draggable("option","disabled",false);
        }
    };

    var dropHandler = function(accept) {
        var dropCanvas = $('#dropFrame').contents().find('#dropCanvas');
        
      return {
        accept:accept,
        snap: true,
        greedy: true,
        hoverClass: "target",
        drop: function (event, ui) {
            
            var item = $(ui.draggable);
            var d = item.attr("data");
            var ele;
            var fromCan = false;
            
            if (item.hasClass("item")){
                // from toolbar
                ele = $(objs[d].ht);
              	ele.attr("data",d);
        	}
            else {
                // from canvas
                ele = item;
                fromCan = true;
            }
            
            if (typeof d!="undefined" && objs[d].ht){
                ele.appendTo(this);
                ele.draggable({snap:true,helper:"clone",cursor:"grab",snapTolerance:10,cancel:false,iframeFix:true,distance:10,cursorAt:{left:'2',top:'13'}});
               
                // set droppable
                if (typeof objs[d].dropClass!="undefined"){
                    //console.log("make droppable a specific class");
                    ele.find(objs[d].dropClass).droppable(dropHandler(objs[d].accept));
                }
                else {
                    ele.droppable(dropHandler(objs[d].accept));
                }
                 
                // mark dropped
                ele.addClass("dropped");
                ele.removeAttr("style");
                
                // hook-up events
                ele.contextmenu(contextHandler).mouseover(mouseoverHandler).mouseout(mouseoutHandler);
                
                // determine what's editable
                var im = ele.find('*:not(:has("*"))');
                if (im.size()===0){
                    ele.addClass("editable");
                }
                else {
                    im.addClass("editable");
                }
                var editable = dropCanvas.find('.editable');
                editable.on('mousedown',clickHandler).on('dblclick',dblclickHandler).on('blur',blurHandler);
            }
            
            return;
        }
    }};
       
    // end d and d -----------------------------------------
    
    // menu ----------------
    
        var scrollBarWidths = 50;
        
        var widthOfList = function(){
            var itemsWidth = 0;
            $('.item').each(function(){
                var itemWidth = $(this).outerWidth();
                itemsWidth+=itemWidth;
            });
            return itemsWidth;
        };
        
        var widthOfHidden = function(){
          return (($('#wrapper').width())-widthOfList()-getLeftPosi())-scrollBarWidths;
        };
        
        var getLeftPosi = function(){
          return $('#dragMenu').position().left;
        };
        
        var reAdjust = function(){
          if (($('#wrapper').outerWidth()) < widthOfList()) {
            $('.scroller-right').show();
          }
          else {
            $('.scroller-right').hide();
          }
          
          if (getLeftPosi()<0) {
            $('.scroller-left').show();
          }
          else {
            $('#dragMenu').animate({left:"-="+getLeftPosi()+"px"},'slow');
            $('.scroller-left').hide();
          }
        }
        
        $(window).on('resize',function(e){  
            reAdjust();
        });
        
        $('.scroller-right').click(function() {
            $('.scroller-left').fadeIn('slow');
            $('.scroller-right').fadeOut('slow');
            $('#dragMenu').animate({left:"+="+widthOfHidden()+"px"},'slow',function(){
                //reAdjust();
            });
        });
        
        $('.scroller-left').click(function() {
            $('.scroller-right').fadeIn('slow');
            $('.scroller-left').fadeOut('slow');
            $('#dragMenu').animate({left:"-="+getLeftPosi()+"px"},'slow');
        });
        
        reAdjust();
        $('.scroller-left').trigger('click');
        
        $('#box').hover(function(){
            $('#hoverStatus').text("Drag and Drop");            
        });

    // end menu

}); // end doc ready

function safeParse(str){
    if (typeof str==="undefined") {
        return {};
    }

    str = str.replace(/\n/g,'\\n');
    str = str.replace(/\r/g,'\\r');
    str = str.replace(/\t/g,'\\t');
   
    return JSON.parse(JSON.stringify(str));
}

var refreshTools = function() {
    
        /* version ? */
        var v,bsv = $('#bootstrapVersion').val();
        if (typeof bsv!="undefined" && bsv.indexOf("2.3")!=-1){
            v=2;
        }
        else {
            v=3;
        }
        
        console.log(v);
        
        /* load snippets */
        $.ajax({
            url: "/comp?v="+v,
            type: "get",
            success: function (data) {
                
                var groups = data;
                snippets = groups;
                
                for (var group in groups) {
                    var groupObj = groups[group];
                    var thisSel = $('#'+group+'Tool');
                    
                    /* clear previous */
                    thisSel.find("optgroup").remove();
                    thisSel.unbind('change');
                    
                    for (var snipType in groupObj) {
                        var snipTypeObj = groupObj[snipType];
                        var snipTypeGroup = $('<optgroup label="'+snipType.replace("_"," ")+'"></optgroup>');
                        
                        for (var snip in snipTypeObj) {
                        
                            var thisSnip = snipTypeObj[snip];
    
                            if (typeof thisSnip.ht != "undefined") {
                                var ht = thisSnip.ht.replace(/"/g, "'");
                                if (thisSnip.i) {
                                    $('<option value="'+group+'.'+snipType+'.'+snip+'" data-subtext="'+ht+'" value="'+ht+'">'+thisSnip.name+'</option>').appendTo(snipTypeGroup);
                                }
                                else {
                                    $('<option value="'+group+'.'+snipType+'.'+snip+'">'+thisSnip.name+'</option>').appendTo(snipTypeGroup);
                                }
                            }
                        }   
                        snipTypeGroup.appendTo(thisSel);
                    }
                    thisSel.change(pickListClick);
                    
                    if (typeof thisSel.data("selectpicker")!="undefined") {
                        thisSel.selectpicker('refresh');
                    }
                    else {
                        thisSel.selectpicker({style:'btn-mini'});   
                    }
                    
                }
                
                $('.pickList').click(pickListClick);
                
                var classSel = $('#ClassTool');
                $.ajax({
                        url: "/classes",
                        type: "get",
                        dataType: "json",
                        success: function (b){
                            for(var i=0;i<b.classes.length;i++) {
                                $('<option>'+b.classes[i]+'</option>').appendTo(classSel);
                            }
    
                            var i2 = $('<icon class="icon-heart-empty icon-xxlarge"> </i>');
                            var copyTool = $('<button class="btn btn-primary pull-center" id="copyTool" title="Copy all code to your clipboard">Copy</button>');
                            var runTool = $('<button class="btn btn-success pull-center" id="runTool" title="Preview this now">Run <icon class="icon-play"> </i></button>');
                
                            copyTool.appendTo("#cmdMenu");
                            runTool.appendTo("#cmdMenu");
                
                            classSel.selectpicker({style:'btn-mini btn-primary',size:'37'});    
                            classSel.change(function(e){
                                var codeToInsert = e.target.options[e.target.selectedIndex].text;
                                if (htmlEditor && htmlEditor.somethingSelected()) {
                                   htmlEditor.replaceSelection(codeToInsert); 
                                }
                                else {
                                    htmlEditor.replaceRange(codeToInsert, htmlEditor.getCursor());
                                }
                                classSel.val('');
                                classSel.selectpicker('render');
                                return false;
                            });
                            
                            $('#toolbarMenu').fadeIn(200);
                            
                        },
                        error: function (e) {console.log('load classes error:'+e)}
                });
            },
            error: function (e) {console.log('load snippets error:'+e)}
        });
    };

var pickListClick = function(e){
    
    var choice;
    
    if (typeof $(this).attr("data")!="undefined"){
        choice = $(this).attr("data");
    }
    else {
        choice = e.target.options[e.target.selectedIndex].value
    }
    
    if (typeof snippets != "undefined") {
    
        var codeObject=eval("snippets."+choice);
        var codeToInsert;
        
        if (codeObject["ht"]) {
            codeToInsert = codeObject["ht"];
            if (htmlEditor && htmlEditor.somethingSelected()) {
               htmlEditor.replaceSelection(codeToInsert); 
            }
            else {
                htmlEditor.replaceRange(codeToInsert, htmlEditor.getCursor());
            }
        }
        
        if (codeObject["js"]) {
            codeToInsert = codeObject["js"];
            if (jsEditor.getValue().indexOf(codeToInsert)===-1){ // only insert if not exist
                if (jsEditor && jsEditor.somethingSelected()) {
                   jsEditor.replaceSelection(codeToInsert); 
                }
                else {
                    jsEditor.replaceRange(codeToInsert, jsEditor.getCursor());
                }
            }
        }
        
        if (codeObject["cs"]) {
            codeToInsert = codeObject["cs"];
            if (cssEditor.getValue().indexOf(codeToInsert)===-1){ // only insert if not exist
                if (cssEditor && cssEditor.somethingSelected()) {
                    cssEditor.replaceSelection(codeToInsert); 
                }
                else {
                    cssEditor.replaceRange(codeToInsert, cssEditor.getCursor());
                }
            }
        }
    
    }
    
    $(this).val('');
    $(this).selectpicker('render');
    return false;
    
};