$(function() {
    var addpostUrl = '/postadmin/addpost';
    //var postlistUrl = '/postadmin/getpost';


    var pageIndex=getQueryString("pageIndex");

    init('');


    $("#submit").click( function(){
        var postTitle=$("#postTitle").val();
        var postContent=$("#postContent").val();
        alert(postTitle);
        //alert(pwd);
        $.ajax({
            url : addpostUrl,
            type : 'get',
            data : {
                postTitle : postTitle,
                postContent:postContent
            },
            dataType : 'json',
            success : function(data) {
                if (data.success) {
                    alert('发布成功!');
                    init('');
                } else {
                    alert('发布失败！');

                }
            }
        });
    });

    $('#postSearch').click(function () {
        var queryKey=$('#queryKey').val();

        init(queryKey);
    });
    $('#myMsg').click(function () {
       // window.location.href="postadmin/mypost";
    });

});

function init(queryKey) {
   // alert(queryKey);
    $.ajax({
        url: "/postadmin/getrecordCount",
        async: false,
        data: {
            queryKey: queryKey
        },
        type: "get",
        dataType: "json",
        success: function (data) {
            if (data.success)
            //alert(data.recordCount);
            //分页插件
                $.jqPaginator('#pagination', {
                    totalCounts: data.recordCount,//总条目数
                    pageSize: 4,//每一页的条目数
                    visiblePages: 20,//最多显示的页码数
                    currentPage: 1,//当前的页码
                    wrapper: '<ul class="pagination" style="display: inline-block;padding-left: 0; margin: 0;border-radius: 4px;"></ul>',
                    first: '<li class="first"><a href="javascript:void(0);">首页</a></li>',
                    prev: '<li class="prev"><a href="javascript:void(0);">上一页</a></li>',
                    next: '<li class="next"><a href="javascript:void(0);">下一页</a></li>',
                    last: '<li class="last"><a href="javascript:void(0);">页尾</a></li>',
                    page: '<li class="page"><a href="javascript:void(0);">{{page}}</a></li>',
                    onPageChange: function (pageIndex) {

                        $.ajax({
                            url: '/postadmin/getpost',
                            async: false,
                            data: {
                                pageIndex: pageIndex,
                                queryKey: queryKey
                            },
                            type: "get",
                            dataType: "json",
                            success: function (data) {
                                if (data.success){
                                var postList = data.postList;
                                $('#posts').html('');
                                var tempHtml = '';


                                postList.map(function(item, index) {
                                    tempHtml += '<div class="post">  '
                                        +' <div class="post-header"> ' + item.postTitle
                                        +'       <span class="glyphicon glyphicon-user">楼主:'
                                        +item.postAuthor.userName +'</span> '
                                        + ' <span class="glyphicon glyphicon-comment">评论</span> '
                                        +      '<span class="glyphicon glyphicon-lock"></span> '
                                        +' <span>时间：'+new Date(item.postTime)
                                            .Format("yyyy-MM-dd") +'</span> '
                                        +' <button class="btn btn-danger" style="float: right">+关注</button>'
                                        +'</div>'
                                        +' <div class="post-content">'
                                        +item.postContent
                                        +'</div> '
                                        +' </div>'
                                });
                                $('#posts').html(tempHtml);
                                }
                           },
                            error: function () {
                                $("#showtable").html("<tr><td style='padding: 160px;text-align: center;' colspan='5'>网络异常...</td></tr>");
                                //隐藏分页div块
                                $("#pags").css("display", "none");
                            }
                        });

                    }
                });
        },
        error: function () {
            $("#showtable").html("<tr><td style='padding: 160px;text-align: center;' colspan='5'>网络异常...</td></tr>");
            //隐藏分页div块
            $("#pags").css("display", "none");
        }
    });
}