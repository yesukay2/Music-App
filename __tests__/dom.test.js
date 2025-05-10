test("updates progress bar width", () => {
  document.body.innerHTML = `<div class="progress-bar" style="width: 0%"></div>`;
  const progressBar = document.querySelector(".progress-bar");

  function updateProgressBar(percent) {
    progressBar.style.width = `${percent}%`;
  }

  updateProgressBar(75);
  expect(progressBar.style.width).toBe("75%");
});
