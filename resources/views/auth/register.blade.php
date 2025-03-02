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
            transform: translate(-50%, -50%);
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
            background: linear-gradient(to right, rgba(221, 216, 254, 1), rgba(221, 216, 254, 0)); /*Standard*/
        }

        .container-fluid {
            padding: 0;
        }

        .modal-backdrop {
            background-color: rgba(255, 255, 255, 0.5);
        }

        .modal-content {
            margin: 0;
        }

        .panel {
            margin-bottom: 0;
        }

        @media (max-width: 767px) {
            .panel {
                width: 100%;
                margin-bottom: 20px;
            }

            .panel-body {
                padding: 15px;
            }
        }
    </style>

    @if(config('google-analytics.enabled'))
        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id={{ config('google-analytics.id') }}"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '{{ config('google-analytics.id') }}');
        </script>
    @endif
</head>
<body class="bg-grad">

<div class="modal-backdrop" id="loader">
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
        </div>
    </div>
</div>

<div style="height:100%;">
    <div class="container-fluid" style="padding:0">
        <div class="row">
            <div class="col-xs-12 col-md-6" style="padding:30px; height:130px;">
                <a href="/"><img src="{{ asset('assets/images/logo-baris.png') }}" class="img-responsive "
                                 alt="Logo sahabat profesional" style="width: 60%"></a>
            </div>
            <div class="col-xs-12 col-md-6 hidden-xs"
                 style="height:130px; background-image:url('{{ asset('assets/bkn/images/header-bg.png') }}'); background-repeat: no-repeat; background-size: fill">
            </div>
        </div>
    </div>

    <div style="height:2px; background-color:#BDC2FD"></div>

    <div class="panel panel-default vh-center" style="width:80%; margin:auto; margin-bottom:100px; margin-top: 40px">
        <div class="panel-heading">
            <h3 class="panel-title">BUAT AKUN</h3>
        </div>
        <div class="panel-body">
            <form class="form-horizontal" action="{{ route('register') }}" method="post">
                @csrf

                <div class="form-group @error('name') has-error @enderror">
                    <label for="Nama" class="col-sm-2 control-label">Nama</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="Nama" placeholder="Nama" name="name"
                               value="{{ old('name') }}" required>
                        @error('name')
                        <span class="help-block">{{ $message }}</span>
                        @enderror
                    </div>
                </div>

                <div class="form-group @error('nik') has-error @enderror">
                    <label for="nik" class="col-sm-2 control-label">NIK</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="nik" placeholder="NIK" name="nik"
                               value="{{ old('nik') }}" required>
                        @error('nik')
                        <span class="help-block">{{ $message }}</span>
                        @enderror
                    </div>
                </div>

                <div class="form-group @error('password') has-error @enderror">
                    <label for="password" class="col-sm-2 control-label">Password</label>
                    <div class="col-sm-10">
                        <input type="password" class="form-control" id="password" placeholder="Password" name="password"
                               minlength="8" required>
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

                @if(config('app.env') == 'production')
                    <div class="form-group @error('g-recaptcha-response') has-error @enderror">
                        <label for="" class="col-sm-2 control-label">Verifikasi</label>
                        <div class="col-sm-10">
                            <div class="g-recaptcha" data-sitekey="6LcEzZUqAAAAAFr63efEGb81fDbz4cCri8FfSeAO"></div>
                            @error('g-recaptcha-response')
                            <span class="help-block">{{ $message }}</span>
                            @enderror
                        </div>
                    </div>
                @endif

                <div class="form-group">
                    <div class="col-sm-offset-2 col-sm-3">
                        <button type="submit" class="btn btn-primary" id="btnLogin">DAFTAR</button>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <div class="container-fluid text-center" style="bottom:0; position:fixed; width:100%; background-color:#BDC2FD">
        <h5>CAT SAHABAT KARIR</h5>
    </div>
</div> <!-- MAIN -->

<script src="https://cdn.jsdelivr.net/npm/jquery@3.1.1/dist/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@3.4.1/dist/js/bootstrap.min.js"></script>
<script src="https://www.google.com/recaptcha/api.js"></script>

<script>
    $(function () {
        sLoader(0);

        function sLoader(tipe) {
            if (tipe == 1) {
                $('#loader').fadeIn();
            } else {
                $('#loader').fadeOut();
            }
        }
    });
</script>
</body>
</html>
