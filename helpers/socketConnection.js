require('./removeByBalue')();

module.exports =  (io) => {
    let userList = []; // 사용자 리스트를 저장할곳

    io.on('connection', socket => { 
        // console.log('채팅을 위한 소켓서버 접속완료');

        //아래 두줄로 passport의 req.user의 데이터에 접근한다.
        const session = socket.request.session.passport;
        const user = typeof session !== 'undefined' ? session.user : '';

        // userList 필드에 사용자 명이 존재 하지 않으면 삽입
        if (!userList.includes(user.displayname)) {
            userList.push(user.displayname);
        }
        io.emit('join', userList);
        
        socket.on('client message', data => {
            // console.log(data);
            io.emit('server message', {
                message : data.message,
                displayname : user.displayname
            });
        });

        // 예약어는 connection, disconnect정도. 나머지는 비교적 자유롭게 네이밍 가능
        socket.on('disconnect', () => {            
            userList.removeByValue(user.displayname);
            io.emit('leave', userList);
        });
    });
};

/*
디비에 저장된 Sessions -> data 내용
{
    "cookie":{
        "originalMaxAge":7200000,
        "expires":"2020-01-21T15:11:21.153Z",
        "httpOnly":true,"path":"/"
        },
    "flash":{},
    "passport":{
        "user":{
            "id":3,
            "username":"yain1468",
            "password":"vUVm7n+fGs5Ci9DAmxbiKeWLtOB0VaKTJiyR686s7RCJnDiXGo1sadYyLhYBko8jBt14jPN6X5ejAMjbkTFgGw==",
            "displayname":"원우",
            "createdAt":"2020-01-21T13:07:58.000Z",
            "updatedAt":"2020-01-21T13:07:58.000Z"
        }
    }
}
*/