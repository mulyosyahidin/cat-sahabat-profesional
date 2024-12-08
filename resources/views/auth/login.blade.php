<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Simulasi CAT</title>

    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.4.1/dist/css/bootstrap.min.css">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
    <style type="text/css">
        @font-face {
            font-family: 'Roboto';
            font-style: normal;
            font-weight: 400;
            src: local('Roboto'), local('Roboto-Regular'), url('../fonts/Roboto.woff2') format('woff2');
        }

        .vh-center {
            position: absolute;
            top: 50%;
            left: 50%;
            margin-right: -50%;
            transform: translate(-50%, -50%)
        }

        html, body {

            height: 100%;

            margin: 0px;

        }

        .bg-grad {
            background:rgba(255,255,255,1); /* For browsers that do not support gradients */
            background: -webkit-linear-gradient(left,rgba(221,216,254,1),rgba(221,216,254,0)); /*Safari 5.1-6*/
            background: -o-linear-gradient(right,rgba(221,216,254,1),rgba(221,216,254,0)); /*Opera 11.1-12*/
            background: -moz-linear-gradient(right,rgba(221,216,254,1),rgba(221,216,254,0)); /*Fx 3.6-15*/
            background: linear-gradient(to right, rgba(221,216,254,1), rgbargba(221,216,254,0)); /*Standard*/
        }
    </style>
</head>
<body class="bg-grad">

<div class="modal-backdrop" style="background-color:rgba(255,255,255,0.5)" id="loader">
    <div class="vh-center">
        <img src="{{ asset('assets/bkn/images/ajax_loader_blue_512.gif') }}" style="width:30px">
    </div>
</div>

<div class="modal fade" tabindex="-1" role="dialog" id="cat-dlg">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="dlgtitle">Modal title</h4>
            </div>
            <div class="modal-body">
                <p id="dlgmessage">One fine body&hellip;</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">OK</button>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<div style="height:100%;">  <!-- MAIN -->

    <div class="container-fluid" style="padding:0">
        <div class="col-xs-6" style="padding:30px; height:130px; background-image:url('{{ asset('assets/bkn/images/bg-head.png') }}'); background-position:right; background-repeat:no-repeat;background-color:#E3DEFE">
            <img src="{{ asset('assets/bkn/images/logo-new2.png') }}">
        </div>
        <div class="col-xs-6" style="height:130px;background-image:url('{{ asset('assets/bkn/images/top-bg.jpg') }}'); background-position:left">

        </div>

    </div>
    <div style="height:2px; background-color:#BDC2FD">

    </div>

    <div class="panel panel-default vh-center" style="width:500px; margin-bottom:100px">
        <div class="panel-heading">
            <h3 class="panel-title">LOGIN DASHBOARD/AKTIFASI PESERTA</h3>
        </div>
        <div class="panel-body">
            <form class="form-horizontal" action="login.php" method="post">
                <div class="form-group">
                    <label for="Email" class="col-sm-2 control-label">Email</label>
                    <div class="col-sm-10">
                        <input type="email" class="form-control" id="Email" placeholder="Email" name="email">
                    </div>
                </div>
                <div class="form-group">
                    <label for="Pass" class="col-sm-2 control-label">Password</label>
                    <div class="col-sm-10">
                        <input type="password" class="form-control" id="Pass" placeholder="Password" name="pass">
                    </div>
                </div>
                <div class="form-group">
                    <label for="" class="col-sm-2 control-label">Verifikasi</label>
                    <div class="col-sm-10">
                        <div class="g-recaptcha" data-sitekey="6LcEzZUqAAAAAFr63efEGb81fDbz4cCri8FfSeAO"></div>
                    </div>
                </div>

                <div class="form-group">
                    <div class="col-sm-offset-2 col-sm-3">
                        <button type="button" class="btn btn-primary" id="btnLogin">LOGIN</button>
                    </div>
                    <div class="col-sm-7">
                        <div class="btn-group">
                            <button type="button" class="btn btn-default" id="daftar">Daftar Gratis</button>
                            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span class="caret"></span>
                                <span class="sr-only">Toggle Dropdown</span>
                            </button>
                            <ul class="dropdown-menu">
                                <li><a href="../">Mulai Simulasi CAT</a></li>
                                <li><a href="http://cat.bkn.go.id">Kembali ke Portal</a></li>
                            </ul>
                        </div>

                    </div>
                </div>



            </form>
        </div>
    </div>


    <div class="container-fluid text-center" style="bottom:0; position:fixed; width:100%; background-color:#BDC2FD">
        <h5>PUSAT PENGEMBANGAN SISTEM SELEKSI - BKN &copy; 2020</h5>
    </div>

</div> <!-- MAIN -->

<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
<script src="https://cdn.jsdelivr.net/npm/jquery@3.1.1/dist/jquery.min.js"></script>
<!-- Include all compiled plugins (below), or include individual files as needed -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@3.4.1/dist/js/bootstrap.min.js"></script>
<script src="https://www.google.com/recaptcha/api.js"></script>

<script>
    $(function() {
        $("#daftar").on("click",function () {
            window.location.href = "../daftar";
        });
        sLoader(0);
        function sLoader(show) {
            loader = $("#loader");
            if (show == 1) {
                loader.show();
            } else {
                loader.hide();
            }
        }

        function sDlg (title,msg) {
            $('#dlgtitle').html(title);
            $('#dlgmessage').html(msg);
            $("#cat-dlg").modal();
        }

        function sReset () {
            $("#Email").val('');
            $("#Pass").val('');
            grecaptcha.reset();
        }

        $("#btnLogin").on("click",function() {
            var Logdata = $('form').serialize();
            $.ajax({
                method:"POST",
                cache:"false",
                url:"login.php",
                data:Logdata,
                beforeSend: function() {
                    sLoader(1);
                },
                success: function(data) {
                    sLoader(0);
                    switch (data) {
                        case "0":
                            sDlg('CAT BKN',"Anda belum terdaftar, silahkan daftar pada portal CAT");
                            sReset();
                            break;
                        case "3":
                            sDlg('CAT BKN',"Password anda salah");
                            sReset();
                            break;
                        case "4":
                            sDlg('CAT BKN',"Silahkan klik kode verifikasi");
                            sReset();
                            break;
                        case "5":
                            sDlg('CAT BKN',"Kode verifikasi salah");
                            sReset();
                            break;
                        case "6":
                            sDlg('CAT BKN',"Email dan password kosong, silahkan isi Email yang sudah terdaftar");
                            sReset();
                            break;
                        case "7":
                            window.location.href = "dash.php";
                            break;
                    }

                },
                error: function() {
                    grecaptcha.reset();
                    console.log("error");
                    sLoader(0);
                }
            });
        });
    });
</script>
</body>
</html>
