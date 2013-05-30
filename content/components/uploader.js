var jQueryUI = require("../public/deps/jQueryUI/jquery-1.9.1.js"),
    fileUploader = require("../public/deps/jquery-File-Upload/jquery.fileupload.js");

var progEv = !!(window.ProgressEvent),
    fdata = !!(window.FormData),
    wCreds = window.XMLHttpRequest && "withCredentials" in new XMLHttpRequest,
    hasXMLRequestLevel2 = progEv && fdata && wCreds,
    ONLYIMAGE = /^(image\/bmp|image\/gif|image\/jpeg|image\/png|image\/tiff)$/i,
    totalSize = 0,
    iMaxFilesize = 10485760, // 10MB
    removeExtension = function (name) {
      return name.replace(/\.[^/.]+$/, "");
    },
    bytesToSize = function (bytes) {
      var sizes = ['Bytes', 'KB', 'MB'];

      if (bytes == 0) return '0 Bytes';
      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
    },
    Files = Backbone.Collection.extend({
        model: Sitecore.Definitions.Models.Model
    }),
    validateFile = function (file) {
      file.errors = file.errors || [];

      if (file.size > iMaxFilesize) {
        file.errors.push({ param: "size", msg: "invalid size" });
      }
    },
    validateFiles = function (files) {
      _.each(files, validateFile);
    },
    prepareData = function (file, oImage) {
      file.__id = _.uniqueId("file_");
      var size = file.size;
      totalSize += size;
      return {
        id: file.__id,
        name: removeExtension(file.name),
        size: size,
        fileSize: bytesToSize(size),
        type: file.type,
        percentage: 0,
        data: file,
        done: undefined,
        bytesTransfered: 0,
        description: "",
        alternate: ""
      };
    },
    setupDataForFiles = function (preview, files, collection, cb) {
      var that = this;

      _.each(files, function (file) {
        var oImage = preview.clone().get(0),
            modelJSON = prepareData(file);

        var isImg = ONLYIMAGE.test(file.type);
        if (typeof FileReader !== "undefined" && isImg) {
            var oReader = new FileReader();
            oReader.onload = function (e) {
                // e.target.result contains the DataURL which we will use as a source of the image
                oImage.src = e.target.result;

                oImage.onload = function () { // binding onload event
                    // we are going to display some custom image information here
                    modelJSON.image = e.target.result;
                    modelJSON.width = oImage.naturalWidth;
                    modelJSON.height = oImage.naturalHeight;
                    modelJSON.error = false;
                    var model = new Sitecore.Definitions.Models.Model(modelJSON);
                    collection.add(model);
                    cb(modelJSON);
                };
            };
            oReader.readAsDataURL(file);
        } else {
            modelJSON.image = "/sitecore/shell/client/Speak/Assets/img//unknown_icon_32.png";
            modelJSON.error = false;
            collection.add(new Sitecore.Definitions.Models.Model(modelJSON));
            cb(modelJSON);
        }
      }, this);
    },
    uploadProgress = function (data, model, cb) { // upload process in progress
      var percentage = Math.round(data.loaded * 100 / data.total),
          bytesTransfered = bytesToSize(data.total);

      model.set("percentage", percentage.toString());
      model.set("bytesTransfered", bytesTransfered);

      cb(model);
    },
    removeFilesFromQueue = function (model) {
      var index = 0;
      _.each(this.datas, function (data) {
        console.log(data.files.length);
        data.files = _.reject(data.files, function (file) {
            return (file.__id === model.get("id"));
        });
        if (data.files.length === 0) {
            delete this.datas[index];
        }
        ++index;
      }, this);

      totalSize = totalSize - model.get("size");

      this.collection.remove(model);
      this.model.set("totalSize", this.getTotalSize());
    },
    updateFromQueue = function (model) {
      var name = model.get("name"),
          description = model.get("description"),
          id = model.get("id");

      _.each(this.datas, function (data) {
        data.files = _.reject(data.files, function (file) {
            if (file.__id === id) {
                file.name = name;
                file.description = description;
            }
        });
      }, this);
    };

_c.component({
    name: "uploader",
    collection: Files,
    listenTo: {
        "upload": "upload"
    },
    attributes: [
        { name: "destinationUrl", value: "$el.data:sc-destinationUrl" },
        { name: "totalFiles", defaultValue: 0 },
        { name: "globalPercentage", defaultValue: 0 },
        { name: "totalSize", defaultValue: "0 Bytes" }
    ],
    initialize: function () {
        if (!hasXMLRequestLevel2) {
            this.$el.find(".drag").hide();
            this.$el.find(".sc-uploader-general-info").hide();
        }
        this.databaseName = /*this.$el.attr("data-sc-databasename")*/ "master";
        this.url = "/api/sitecore/Media/Upload?sc_database=" + this.databaseName;
        this.model.set("totalFiles", 0);
        this.datas = [];
        this.$el.find(".sc-uploader-fileupload").attr("data-url", this.url);
        this.app.on("upload-info-deleted", removeFilesFromQueue, this);
        this.app.on("upload-info-updated", updateFromQueue, this);
        this.$preeview = this.$el.find(".sc-uploader-preview");
        this.uploadFile = this.$el.find(".sc-uploader-fileupload");
        this.collection.on("add", this.fileAdded, this);
        this.collection.on("remove", this.refreshNumberFiles, this);
        this.refreshNumberFiles();
    },
    getTotalSize: function () {
        return bytesToSize(totalSize);
    },
    fileAdded: function (model) {
        this.refreshNumberFiles();
        this.app.trigger("upload-fileAdded", model);
    },
    refreshNumberFiles: function () {
        this.model.set("totalFiles", this.collection.length);
    },
    upload: function () {
        //for each files - do the upload
        _.each(this.datas, function (data) {
            data.submit();
        });
    },
    updateRealImage: function (data, id) {
        model = _.find(this.collection.models, function (model) {
            return model.get("id") === id;
        });

        model.set("image", data.uploadedFileItems[0].Icon);
    },
    afterRender: function () {            
        var that = this;
        this.uploadFile.fileupload({

            add: function (e, data) {
                that.model.set("globalPercentage", 0);
                var files = data.files,
                    currentNumber = that.model.get("totalFiles") || 0;

                that.model.set("totalFiles", (currentNumber + files.length));

                validateFiles(files);
                setupDataForFiles(that.$preeview, files, that.collection, function (model) {

                    /*if (data.form) {
                        data.form.__id = model.id;
                    } else {*/
                        e.target.form.__ids = e.target.form.__ids || [];
                        e.target.form.__ids.push(model.id);
                    /*}*/

                    data.__id = model.id;

                    that.datas.push(data);
                    that.model.set("totalSize", that.getTotalSize());
                });
            },
            progressall: function (e, data) {
                var percentage = Math.round(data.loaded * 100 / data.total),
                    bytesTransfered = bytesToSize(data.total);

                that.model.set("globalPercentage", percentage);
            },
            formData: function (form) {
                var id = form.context.__id /*= form.__id || form.context.__id*/,
                    data = form.serializeArray(),
                    model;

                //if (!id) {
                    id = form.context.__ids.shift();
                //}

                model = _.find(that.collection.models, function (model) {
                        return model.id === id;
                }),
                name = model.get("name"),
                description = model.get("description");
                alternate = model.get("alternate");
                data.push({ name: "name", value: name });
                data.push({ name: "description", value: description });
                data.push({ name: "alternate", value: alternate });

                return data;
            },
            done: function (e, data) {
                that.datas = [];
                totalSize = 0;
                that.model.set("totalFiles", 0);

                if (data.jqXHR) {
                    data.jqXHR.done(function (res) {
                        var models = [];
                        if (res.errorItems) {
                            _.each(res.errorItems, function (error) {
                                error.id = data.__id;
                            });
                            
                            that.app.trigger("sc-error", res.errorItems);                                
                            that.app.trigger("upload-error", { id: data.__id, errors: res.errorItems });
   
                            return undefined;
                        }
                        
                        that.updateRealImage.call(that, res, data.__id);

                        ids = _.pluck(data.files, "__id");

                        that.collection.each(function (model) {
                            if (_.contains(ids, model.get("id"))) {
                                models.push(model);
                            }
                        });

                        _.each(models, function (model) {
                            model.set("percentage", 100);
                            that.collection.remove(model);
                        }, this);

                        that.refreshNumberFiles();
                        that.model.set("totalSize", that.getTotalSize());
                    });
                }
            },
            autoUpload: false,
            dataType: 'json'
        });

        this.uploadFile.bind("fileuploadprogress", function (e, data) {
            var id = data.files[0].__id;

            var update = _.find(that.collection.models, function (img) {
                return img.get("id") === id;
            }, this);
            if (update) {
                uploadProgress(data, update, function (model) {
                    that.trigger("upload-progress", model.toJSON());
                });
            }
        });
    }
});
