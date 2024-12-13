<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Hasil Ujian {{ $exam->name }}</title>

    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }

        .table-container {
            margin: 20px;
            border-collapse: collapse;
            width: 100%;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th, td {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
            font-size: 8px;
        }

        th {
            background-color: #f2f2f2;
        }

        tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        tr:hover {
            background-color: #e6f7ff;
        }

        .text-center {
            text-align: center;
        }
    </style>
</head>
<body>
<div class="table-container">
    <table>
        <thead>
        <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Email</th>
            <th>Jabatan Dilamar</th>
            @foreach($questionTypes as $questionType)
                <th>{{ $questionType->name }}</th>
            @endforeach
            <th>Total Nilai</th>
        </tr>
        </thead>
        <tbody>
        @foreach($exam->participants as $participant)
            <tr>
                <td>{{ $loop->iteration }}</td>
                <td>{{ $participant->user->name }}</td>
                <td>{{ $participant->user->email }}</td>
                <td>{{ $participant->position->name }}</td>
                @foreach($questionTypes as $questionType)
                    <td class="text-center">
                        {{ $participant->session->typeScores->where('question_type_id', $questionType->id)->first()->score }}
                    </td>
                @endforeach
                <td class="text-center">{{ $participant->session->total_score }}</td>
            </tr>
        @endforeach
        </tbody>
    </table>
</div>

</body>
</html>
