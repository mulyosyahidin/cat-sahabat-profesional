<?php

namespace App\Imports;

use App\Models\Formation;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class FormationQuestionImport implements ToCollection, WithHeadingRow
{
    /**
     * @var Formation $formation
     */
    protected Formation $formation;

    /**
     * FormationQuestionImport constructor.
     *
     * @param Formation $formation
     */
    public function __construct(Formation $formation)
    {
        $this->formation = $formation;
    }

    /**
     * @param Collection $rows
     */
    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            $position = $this->formation->positions()->firstOrCreate(
                ['name' => $row['jabatan']],
                ['maximum_test_duration' => $row['durasi_ujian']]
            );

            $questionType = $position->questionTypes()->firstOrCreate(
                ['name' => $row['jenis_soal']],
                [
                    'weighting_type' => $row['tipe_nilai'] == 1 ? 'FIVE_AND_ZERO' : 'FIVE_TO_ONE',
                    'display_order' => $row['urutan_ditampilkan'],
                ]
            );

            $question = $questionType->questions()->firstOrCreate(
                ['question' => trim($row['soal'])],
                ['discussion' => trim($row['pembahasan'])]
            );

            $options = [
                ['question_id' => $question->id, 'option' => 'A', 'value' => $row['pilgan_a'] ?? '', 'is_correct' => $row['kunci'] === 'A', 'score' => $row['nilai_a'] ?? 0],
                ['question_id' => $question->id, 'option' => 'B', 'value' => $row['pilgan_b'] ?? '', 'is_correct' => $row['kunci'] === 'B', 'score' => $row['nilai_b'] ?? 0],
                ['question_id' => $question->id, 'option' => 'C', 'value' => $row['pilgan_c'] ?? '', 'is_correct' => $row['kunci'] === 'C', 'score' => $row['nilai_c'] ?? 0],
                ['question_id' => $question->id, 'option' => 'D', 'value' => $row['pilgan_d'] ?? '', 'is_correct' => $row['kunci'] === 'D', 'score' => $row['nilai_d'] ?? 0],
                ['question_id' => $question->id, 'option' => 'E', 'value' => $row['pilgan_e'] ?? '', 'is_correct' => $row['kunci'] === 'E', 'score' => $row['nilai_e'] ?? 0],
            ];

            $question->options()->delete();
            $question->options()->insert($options);
        }
    }
}
