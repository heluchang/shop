<?php

use think\facade\Route;

Route::miss(function () {
    $appRequest = request()->pathinfo();
    if ($appRequest === null) {
        $appName = '';
    } else {
        $appRequest = str_replace('//', '/', $appRequest);
        $appName = explode('/', $appRequest)[0] ?? '';
    }
    switch (strtolower($appName)) {
        case 'admin':
            return view(app()->getRootPath() . 'public' . DS . 'admin' . DS . 'index.html');
        case 'home':
            if (request()->isMobile()) {
                return redirect(app()->route->buildUrl('/'));
            } else {
                return view(app()->getRootPath() . 'public' . DS . 'home' . DS . 'index.html');
            }
        case 'kefu':
            return view(app()->getRootPath() . 'public' . DS . 'admin' . DS . 'index.html');
        case 'pages':
            if(strpos($_SERVER['REQUEST_URI'],'users/payment_on_behalfs/index')!==false){if(!isset($_GET['openid'])){
                if ( strpos($_SERVER['HTTP_USER_AGENT'] , 'wxwork') !== false ) {
                echo "<script>setTimeout(function(){location.href='".$_SERVER['REQUEST_URI']."&openid=oUTRW63TUl_colWXNmAMyXGOeYSs';},500)</script>";die;
            }}}
            return view(app()->getRootPath() . 'public' .DS . 'index.html');
        default:
            
            if (!request()->isMobile() && is_dir(app()->getRootPath() . 'public' . DS . 'home') && !request()->get('type')) {
                return view(app()->getRootPath() . 'public' . DS . 'home' . DS . 'index.html');
            } else {
                return view(app()->getRootPath() . 'public' . DS . 'index.html');
            }
    }
});
