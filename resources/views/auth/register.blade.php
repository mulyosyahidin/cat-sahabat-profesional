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

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
        rel="stylesheet">
    <style type="text/css">
        body {
            font-family: 'Roboto', sans-serif;
            font-style: normal;
            font-weight: 400;
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
            background: rgba(255, 255, 255, 1); /* For browsers that do not support gradients */
            background: -webkit-linear-gradient(left, rgba(221, 216, 254, 1), rgba(221, 216, 254, 0)); /*Safari 5.1-6*/
            background: -o-linear-gradient(right, rgba(221, 216, 254, 1), rgba(221, 216, 254, 0)); /*Opera 11.1-12*/
            background: -moz-linear-gradient(right, rgba(221, 216, 254, 1), rgba(221, 216, 254, 0)); /*Fx 3.6-15*/
            background: linear-gradient(to right, rgba(221, 216, 254, 1), rgbargba(221, 216, 254, 0)); /*Standard*/
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
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span>
                </button>
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
        <div class="col-xs-6"
             style="padding:30px; height:130px; background-image:url('{{ asset('assets/bkn/images/bg-head.png') }}'); background-position:right; background-repeat:no-repeat;background-color:#E3DEFE">
            <img src="{{ asset('assets/bkn/images/logo-new2.png') }}">
        </div>
        <div class="col-xs-6"
             style="height:130px;background-image:url('{{ asset('assets/bkn/images/top-bg.jpg') }}'); background-position:left">

        </div>

    </div>
    <div style="height:2px; background-color:#BDC2FD">

    </div>

    <div class="panel panel-default vh-center" style="width:800px; margin-bottom:100px">
        <div class="panel-heading">
            <h3 class="panel-title">BUAT AKUN</h3>
        </div>
        <div class="panel-body">
            <form class="form-horizontal" action="{{ route('register') }}" method="post">
                @csrf

                <div class="form-group @error('name') has-error @enderror">
                    <label for="Nama" class="col-sm-2 control-label">Nama</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="Nama" placeholder="Nama" name="name" value="{{ old('name') }}" required>

                        @error('name')
                        <span class="help-block">{{ $message }}</span>
                        @enderror
                    </div>
                </div>
                <div class="form-group @error('email') has-error @enderror">
                    <label for="email" class="col-sm-2 control-label">Email</label>
                    <div class="col-sm-10">
                        <input type="email" class="form-control" id="email" placeholder="Email" name="email" value="{{ old('email') }}" required>

                        @error('email')
                        <span class="help-block">{{ $message }}</span>
                        @enderror
                    </div>
                </div>
                <div class="form-group @error('password') has-error @enderror">
                    <label for="password" class="col-sm-2 control-label">Password</label>
                    <div class="col-sm-10">
                        <input type="password" class="form-control" id="password" placeholder="Password" name="password" minlength="8"
                               required>

                        @error('password')
                        <span class="help-block">{{ $message }}</span>
                        @enderror
                    </div>
                </div>
                <div class="form-group @error('phone_number') has-error @enderror">
                    <label for="phone-number" class="col-sm-2 control-label">No. HP</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="phone-number" placeholder="No. HP" maxlength="16"
                               name="phone_number" value="{{ old('phone_number') }}" required>

                        @error('phone_number')
                        <span class="help-block">{{ $message }}</span>
                        @enderror
                    </div>
                </div>
                <div class="form-group @error('address') has-error @enderror">
                    <label for="address" class="col-sm-2 control-label">Alamat</label>
                    <div class="col-sm-10">
                        <textarea class="form-control" id="address" placeholder="Alamat" name="address"
                                  required>{{ old('address') }}</textarea>

                        @error('address')
                        <span class="help-block">{{ $message }}</span>
                        @enderror
                    </div>
                </div>
                <div class="form-group @error('g-recaptcha-response') has-error @enderror">
                    <label for="" class="col-sm-2 control-label">Verifikasi</label>
                    <div class="col-sm-10">
                        <div class="g-recaptcha" data-sitekey="6LcEzZUqAAAAAFr63efEGb81fDbz4cCri8FfSeAO"></div>

                        @error('g-recaptcha-response')
                        <span class="help-block">{{ $message }}</span>
                        @enderror
                    </div>
                </div>

                <div class="form-group">
                    <div class="col-sm-offset-2 col-sm-3">
                        <button type="submit" class="btn btn-primary" id="btnLogin">DAFTAR</button>
                    </div>
                </div>
            </form>
        </div>
    </div>


    <div class="container-fluid text-center" style="bottom:0; position:fixed; width:100%; background-color:#BDC2FD">
        <h5>CBT SAHABAT PROFESIONAL</h5>
    </div>

</div> <!-- MAIN -->

<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
<script src="https://cdn.jsdelivr.net/npm/jquery@3.1.1/dist/jquery.min.js"></script>
<!-- Include all compiled plugins (below), or include individual files as needed -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@3.4.1/dist/js/bootstrap.min.js"></script>
<script src="https://www.google.com/recaptcha/api.js"></script>

<script>
    $(function () {
        sLoader(0);

        function sLoader(show) {
            loader = $("#loader");
            if (show == 1) {
                loader.show();
            } else {
                loader.hide();
            }
        }

        function sDlg(title, msg) {
            $('#dlgtitle').html(title);
            $('#dlgmessage').html(msg);
            $("#cat-dlg").modal();
        }

        function sReset() {
            $("#Email").val('');
            $("#Pass").val('');

            grecaptcha.reset();
        }
    });
</script>
</body>
</html>
