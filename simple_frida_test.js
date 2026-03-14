// Простой Frida тест для Brawl Stars
// Создает кнопку "D" и показывает меню

Java.perform(function() {
    console.log("🎮 [FRIDA] Загрузка тестового меню...");
    
    // Получаем текущую активность
    function getCurrentActivity() {
        var ActivityThread = Java.use("android.app.ActivityThread");
        var currentActivityThread = ActivityThread.currentActivityThread();
        var activities = currentActivityThread.mActivities.value;
        
        for (var key in activities) {
            var activityRecord = activities[key];
            if (!activityRecord.paused.value) {
                return activityRecord.activity.value;
            }
        }
        return null;
    }
    
    // Создаем overlay кнопку
    function createOverlayButton() {
        Java.scheduleOnMainThread(function() {
            try {
                var activity = getCurrentActivity();
                if (!activity) {
                    console.log("❌ Активность не найдена, повторная попытка...");
                    setTimeout(createOverlayButton, 2000);
                    return;
                }
                
                var Button = Java.use("android.widget.Button");
                var FrameLayout = Java.use("android.widget.FrameLayout");
                var LayoutParams = Java.use("android.widget.FrameLayout$LayoutParams");
                var Gravity = Java.use("android.view.Gravity");
                var Color = Java.use("android.graphics.Color");
                
                // Получаем root view
                var rootView = activity.findViewById(16908290); // android.R.id.content
                
                // Создаем кнопку
                var testButton = Button.$new(activity);
                testButton.setText("D");
                testButton.setTextSize(18);
                testButton.setTextColor(Color.WHITE.value);
                testButton.setBackgroundColor(Color.parseColor("#FF4444"));
                
                // Параметры позиционирования
                var params = LayoutParams.$new(150, 150);
                params.gravity.value = Gravity.LEFT.value | Gravity.BOTTOM.value;
                params.leftMargin.value = 50;
                params.bottomMargin.value = 200;
                
                // Добавляем кнопку
                rootView.addView(testButton, params);
                
                // Обработчик клика
                var OnClickListener = Java.use("android.view.View$OnClickListener");
                var clickHandler = Java.registerClass({
                    name: "com.frida.ButtonHandler",
                    implements: [OnClickListener],
                    methods: {
                        onClick: function(view) {
                            showSimpleMenu(activity);
                        }
                    }
                });
                
                testButton.setOnClickListener(clickHandler.$new());
                
                console.log("✅ [FRIDA] Кнопка 'D' создана!");
                
            } catch (e) {
                console.log("❌ [FRIDA] Ошибка создания кнопки: " + e);
                console.log("🔄 Повторная попытка через 3 секунды...");
                setTimeout(createOverlayButton, 3000);
            }
        });
    }
    
    // Показываем простое меню
    function showSimpleMenu(activity) {
        Java.scheduleOnMainThread(function() {
            try {
                var AlertDialog = Java.use("android.app.AlertDialog");
                var AlertDialogBuilder = Java.use("android.app.AlertDialog$Builder");
                var DialogInterface = Java.use("android.content.DialogInterface");
                
                var builder = AlertDialogBuilder.$new(activity);
                builder.setTitle("🎮 Frida Test Menu");
                builder.setMessage("✅ Frida Gadget работает!\n\n📱 Приложение: Brawl Stars\n🔧 Готов к модификации\n\n🧪 Тесты пройдены успешно!");
                
                // Кнопка "Тест"
                var testClickListener = Java.registerClass({
                    name: "com.frida.TestClickListener", 
                    implements: [DialogInterface.OnClickListener],
                    methods: {
                        onClick: function(dialog, which) {
                            runQuickTest(activity);
                        }
                    }
                });
                builder.setPositiveButton("🧪 Тест", testClickListener.$new());
                
                // Кнопка "Закрыть"
                var closeClickListener = Java.registerClass({
                    name: "com.frida.CloseClickListener",
                    implements: [DialogInterface.OnClickListener], 
                    methods: {
                        onClick: function(dialog, which) {
                            dialog.dismiss();
                        }
                    }
                });
                builder.setNegativeButton("❌ Закрыть", closeClickListener.$new());
                
                var dialog = builder.create();
                dialog.show();
                
                console.log("✅ [FRIDA] Меню показано!");
                
            } catch (e) {
                console.log("❌ [FRIDA] Ошибка показа меню: " + e);
            }
        });
    }
    
    // Быстрый тест функций
    function runQuickTest(activity) {
        console.log("🧪 [TEST] Запуск быстрых тестов...");
        
        try {
            // Тест 1: Информация о приложении
            var packageName = activity.getPackageName();
            console.log("📦 [TEST] Package: " + packageName);
            
            // Тест 2: Проверка GameApp класса
            try {
                var GameApp = Java.use("com.supercell.brawlstars.GameApp");
                console.log("✅ [TEST] GameApp класс найден");
            } catch (e) {
                console.log("❌ [TEST] GameApp класс не найден: " + e);
            }
            
            // Тест 3: Проверка Titan классов
            try {
                var TitanGameApp = Java.use("com.supercell.titan.GameApp");
                console.log("✅ [TEST] TitanGameApp класс найден");
            } catch (e) {
                console.log("❌ [TEST] TitanGameApp класс не найден: " + e);
            }
            
            // Показываем Toast с результатом
            Java.scheduleOnMainThread(function() {
                var Toast = Java.use("android.widget.Toast");
                Toast.makeText(activity, "🧪 Тесты завершены! Проверьте консоль Frida.", Toast.LENGTH_LONG.value).show();
            });
            
            console.log("✅ [TEST] Все тесты завершены!");
            
        } catch (e) {
            console.log("❌ [TEST] Ошибка тестов: " + e);
        }
    }
    
    // Запускаем создание кнопки через 5 секунд после загрузки
    setTimeout(function() {
        console.log("🚀 [FRIDA] Создание тестовой кнопки...");
        createOverlayButton();
    }, 5000);
    
    console.log("🎯 [FRIDA] Тестовый скрипт загружен!");
    console.log("⏳ Кнопка 'D' появится через 5 секунд в левом нижнем углу");
});