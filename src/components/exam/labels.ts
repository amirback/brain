import type { Dict } from "@/lib/dict/ru";
import type { RunnerLabels } from "./Runner";

/** Every module runner needs the same strings; built once so pages stay short. */
export function runnerLabels(d: Dict): RunnerLabels {
  return {
    timer: d.exam.timer,
    nav: d.exam.nav,
    question: d.exam.question,
    of: d.exam.of,
    back: d.exam.back,
    next: d.exam.next,
    mark: d.exam.mark,
    marked: d.exam.marked,
    finishReview: d.exam.finishReview,
    review: d.exam.review,
    reviewSub: d.exam.reviewSub,
    answered: d.exam.answered,
    unanswered: d.exam.unanswered,
    submit: d.exam.submit,
    confirm: d.exam.confirm,
    confirmBody: d.exam.confirmBody,
    cancel: d.common.cancel,
    typeAnswer: d.exam.typeAnswer,
    passageLabel: d.exam.passageLabel,
  };
}
