let currentTime = new Date();

        function getGradientIndex(hour, minute) {
            const time = hour + minute / 60;

            if (time >= 21 || time < 5) {
                // Night time (20:00 - 05:00)
                if (time >= 20 && time < 22) return 22;
                if (time >= 22 && time < 23) return 23;
                if (time >= 23 || time < 1) return 0;
                if (time >= 1 && time < 2) return 1;
                if (time >= 2 && time < 3) return 2;
                if (time >= 3 && time < 5) return 3;
            } else {
                // Day time (05:00 - 20:00)
                const dayTimeGradients = 18; // gradients 4 to 21
                const dayTimeHours = 15; // 20 - 5
                const hoursPerGradient = dayTimeHours / dayTimeGradients;
                const dayTimeElapsed = time - 5;
                return Math.floor(dayTimeElapsed / hoursPerGradient) + 4;
            }
        }

        function updateBackground(date) {
            const hour = date.getHours();
            const minute = date.getMinutes();
            const gradientIndex = getGradientIndex(hour, minute);
            const gradientClass = `sky-gradient-${gradientIndex.toString().padStart(2, '0')}`;
            document.body.className = gradientClass;
            document.getElementById('timeDisplay').textContent = `Current Time: ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        }

        function changeBackground(direction) {
            currentTime.setMinutes(currentTime.getMinutes() + direction * 60);
            updateBackground(currentTime);
        }

        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                changeBackground(-1);
            } else if (event.key === 'ArrowRight') {
                changeBackground(1);
            }
        });

        function updateRealTimeBackground() {
            currentTime = new Date();
            updateBackground(currentTime);
        }

        updateRealTimeBackground();

        setInterval(updateRealTimeBackground, 60000);