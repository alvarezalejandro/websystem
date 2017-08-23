'use strict';

angular.module('Core').factory('dataService', [
    function () {
        var config = {
            apiKey: "AIzaSyB9Whv3MmJEZz2sp2BXf4gVh3PAmkKv1qI",
            authDomain: "siisp-dev.firebaseapp.com",
            databaseURL: "https://siisp-dev.firebaseio.com",
            projectId: "siisp-dev",
            storageBucket: "siisp-dev.appspot.com"
        };
        firebase.initializeApp(config);

        return {
            login: function(email, password) {
                return firebase.auth().signInWithEmailAndPassword(email, password);
            },
            getData: function(referenceName, callback, param){
                var dataRef = firebase.database().ref(referenceName);
                dataRef.on('value', function(snapshot) {
                    var data = snapshot.val();
                    callback(data, param);
                });
            },
            saveObject:function(referenceName, object, onCompleted){
                if(object.id==null)
                {
                    object.id = firebase.database().ref().child(referenceName).push().key;
                }

                firebase.database().ref(referenceName+'/' + object.id ).set(object, onCompleted);
            },
            update:function(referenceName, value){
                firebase.database().ref(referenceName).update(value);
            },
            deleteObject:function(referenceName, object){
                firebase.database().ref(referenceName+'/' + object.id ).remove();
            },
            deleteItemOfAnObject:function(referenceName){
                firebase.database().ref(referenceName).remove();
            },
            uploadFile:function(referenceName, file, onUploading, onError, onUploaded) {
                var storageRef = firebase.storage().ref();
                var uploadTask = storageRef.child(referenceName).put(file);
                uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, onUploading, onError, function () {
                    onUploaded(uploadTask.snapshot.downloadURL);
                });
            },
            deleteUploadedFile:function(referenceName, onDeleted, onError){
                var storageRef = firebase.storage().ref();
                var desertRef = storageRef.child(referenceName);
                desertRef.delete().then(onDeleted).catch(onError);
            }
        };
    }
]);