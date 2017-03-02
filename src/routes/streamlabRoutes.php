<?php


Route::get('/sl', function () {
    return view('test');
});

Route::post("streamLab/create/user" , function(\Illuminate\Http\Request $request){
    return \StreamLab\StreamLabProvider\Facades\StreamLabFacades::createUser($request->all());
});

Route::post('streamLab/post/message' , function(\Illuminate\Http\Request $request){
    return \StreamLab\StreamLabProvider\Facades\StreamLabFacades::pushMessage($request->channelName , $request->eventName , $request->message);
});

Route::post('streamLab/update/user' , function(\Illuminate\Http\Request $request){
    return \StreamLab\StreamLabProvider\Facades\StreamLabFacades::updateUser($request->all());
});

Route::get('streamLab/app/user' , function(\Illuminate\Http\Request $request){
    return \StreamLab\StreamLabProvider\Facades\StreamLabFacades::getAppUser(
        config('stream_lab.app_id')
        ,config('stream_lab.token')
        , $request->limit
        , $request->offset
        , $request->channel );
});

Route::get('streamLab/app/getAllChannels' , function(\Illuminate\Http\Request $request){
    return \StreamLab\StreamLabProvider\Facades\StreamLabFacades::GetAllChannels();
});

Route::get('streamLab/app/checkuser' , function(\Illuminate\Http\Request $request){
    return \StreamLab\StreamLabProvider\Facades\StreamLabFacades::getUser($request->id);
});


Route::get('streamLab/app/get/channel' , function(\Illuminate\Http\Request $request){
    return \StreamLab\StreamLabProvider\Facades\StreamLabFacades::GetChannel($request->channelName , $request->secret);
});


Route::get('streamLab/app/user/delete' , function(\Illuminate\Http\Request $request){
    return \StreamLab\StreamLabProvider\Facades\StreamLabFacades::deleteUser($request->id);
});


Route::get('StreamLab/create/Channel' , function(\Illuminate\Http\Request $request){
    return \StreamLab\StreamLabProvider\Facades\StreamLabFacades::CreateChannel($request->channelName  ,$request->secret);
});



Route::get('StreamLab/delete/Channel' , function(\Illuminate\Http\Request $request){
    return \StreamLab\StreamLabProvider\Facades\StreamLabFacades::DeleteChannel($request->channelName);
});

