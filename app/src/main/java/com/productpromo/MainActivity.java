package com.productpromo;

import android.app.Activity;
import android.content.*;
import android.database.Cursor;
import android.graphics.Color;
import android.net.Uri;
import android.os.*;
import android.provider.MediaStore;
import android.view.*;
import android.widget.*;
import java.util.*;

public class MainActivity extends Activity {
    private static final int PICK_IMAGES=10, PICK_AUDIO=11;
    private final ArrayList<Uri> images=new ArrayList<>();
    private EditText name, price, oldPrice, tagline, features, howTo, note;
    private Spinner duration; private ImageView preview; private TextView imageCount, musicName, status;
    private ProgressBar progress; private Button render, cancel; private Uri music; private VideoExporter exporter; private VideoView result;
    private int dp(float v){return (int)(v*getResources().getDisplayMetrics().density+.5f);}
    private TextView label(String text){ TextView v=new TextView(this); v.setText(text); v.setTextColor(Color.rgb(180,188,198)); v.setTextSize(12); v.setPadding(0,dp(10),0,0); return v; }
    private EditText input(String hint,String value){ EditText e=new EditText(this); e.setHint(hint); e.setText(value); e.setTextColor(Color.WHITE); e.setHintTextColor(Color.rgb(120,130,145)); e.setSingleLine(false); e.setPadding(dp(12),dp(8),dp(12),dp(8)); return e; }
    @Override public void onCreate(Bundle b){super.onCreate(b); buildUi();}
    private void buildUi(){
        LinearLayout root=new LinearLayout(this); root.setOrientation(LinearLayout.VERTICAL); root.setBackgroundColor(Color.rgb(10,16,22));
        TextView bar=label("▶  ProductPromo  V5"); bar.setTextSize(20); bar.setTextColor(Color.WHITE); bar.setPadding(dp(18),dp(18),dp(18),dp(18)); root.addView(bar);
        ScrollView scroll=new ScrollView(this); LinearLayout body=new LinearLayout(this); body.setOrientation(LinearLayout.VERTICAL); body.setPadding(dp(18),0,dp(18),dp(28)); scroll.addView(body); root.addView(scroll,new LinearLayout.LayoutParams(-1,0,1));
        preview=new ImageView(this); preview.setBackgroundColor(Color.rgb(25,30,36)); preview.setScaleType(ImageView.ScaleType.CENTER_CROP); body.addView(preview,new LinearLayout.LayoutParams(-1,dp(270))); 
        name=input("ชื่อสินค้า","ไมโครโฟนคอนเดนเซอร์สำหรับสตรีมและเล่นเกม"); add(body,"ชื่อสินค้า",name);
        LinearLayout prices=new LinearLayout(this); prices.setOrientation(LinearLayout.HORIZONTAL); price=input("ราคา","890"); oldPrice=input("ราคาเดิม","1290"); prices.addView(price,new LinearLayout.LayoutParams(0,-2,1)); prices.addView(oldPrice,new LinearLayout.LayoutParams(0,-2,1)); body.addView(prices);
        tagline=input("คำโปรย","เสียงชัด ใช้งานง่าย เหมาะกับสตรีมและประชุม"); add(body,"คำโปรย",tagline);
        features=input("จุดเด่น","รับเสียงคมชัด\nเชื่อมต่อง่าย\nปรับระดับเสียงได้\nเหมาะกับเกมและประชุม"); add(body,"จุดเด่น",features);
        howTo=input("วิธีใช้","เสียบสาย -> เลือกไมโครโฟนในอุปกรณ์ -> ปรับระดับเสียง -> พร้อมใช้งาน"); add(body,"วิธีใช้",howTo);
        note=input("ข้อควรรู้","จัดตำแหน่งไมค์ให้เหมาะสมและหลีกเลี่ยงเสียงรบกวนรอบข้าง"); add(body,"ข้อควรรู้",note);
        Button pick=new Button(this); pick.setText("เลือกรูปสินค้า (สูงสุด 10 รูป)"); pick.setOnClickListener(v->pickImages()); body.addView(pick); imageCount=label("0 / 10 รูป"); body.addView(imageCount);
        Button song=new Button(this); song.setText("เลือกเพลงประกอบ"); song.setOnClickListener(v->pickAudio()); body.addView(song); musicName=label("ยังไม่ได้เลือกเพลง"); body.addView(musicName);
        duration=new Spinner(this); String[] ds={"15 วินาที","30 วินาที","60 วินาที"}; duration.setAdapter(new ArrayAdapter<String>(this,android.R.layout.simple_spinner_dropdown_item,ds)); body.addView(label("ความยาวรวม")); body.addView(duration);
        render=new Button(this); render.setText("สร้างวิดีโอ MP4"); render.setTextColor(Color.WHITE); render.setBackgroundColor(Color.rgb(194,112,57)); render.setOnClickListener(v->startRender()); body.addView(render);
        cancel=new Button(this); cancel.setText("ยกเลิก"); cancel.setEnabled(false); cancel.setOnClickListener(v->{if(exporter!=null) exporter.cancel();}); body.addView(cancel);
        progress=new ProgressBar(this,null,android.R.attr.progressBarStyleHorizontal); progress.setMax(100); body.addView(progress,new LinearLayout.LayoutParams(-1,dp(8))); status=label("พร้อมสร้าง 720 x 1280 • H.264/AVC + AAC • MP4"); body.addView(status);
        result=new VideoView(this); result.setVisibility(View.GONE); body.addView(result,new LinearLayout.LayoutParams(-1,dp(320)));
        setContentView(root);
    }
    private void add(LinearLayout b,String title,EditText e){b.addView(label(title));b.addView(e,new LinearLayout.LayoutParams(-1,-2));}
    private void pickImages(){Intent i=new Intent(Intent.ACTION_OPEN_DOCUMENT);i.setType("image/*");i.putExtra(Intent.EXTRA_ALLOW_MULTIPLE,true);i.addCategory(Intent.CATEGORY_OPENABLE);startActivityForResult(i,PICK_IMAGES);}
    private void pickAudio(){Intent i=new Intent(Intent.ACTION_OPEN_DOCUMENT);i.setType("audio/*");i.addCategory(Intent.CATEGORY_OPENABLE);startActivityForResult(i,PICK_AUDIO);}
    @Override protected void onActivityResult(int r,int c,Intent d){super.onActivityResult(r,c,d);if(c!=RESULT_OK||d==null)return;if(r==PICK_IMAGES){images.clear();if(d.getClipData()!=null)for(int n=0;n<Math.min(10,d.getClipData().getItemCount());n++)images.add(d.getClipData().getItemAt(n).getUri());else if(d.getData()!=null)images.add(d.getData());if(!images.isEmpty())preview.setImageURI(images.get(0));imageCount.setText(images.size()+" / 10 รูป");}else{music=d.getData();musicName.setText(fileName(music));}}
    private String fileName(Uri u){Cursor c=getContentResolver().query(u,null,null,null,null);try{if(c!=null&&c.moveToFirst()){int x=c.getColumnIndex(MediaStore.MediaColumns.DISPLAY_NAME);if(x>=0)return c.getString(x);}}finally{if(c!=null)c.close();}return u.toString();}
    private void startRender(){if(images.isEmpty()){Toast.makeText(MainActivity.this,"กรุณาเลือกรูปอย่างน้อย 1 รูป",Toast.LENGTH_SHORT).show();return;}int sec=15+(duration.getSelectedItemPosition()*15);if(duration.getSelectedItemPosition()==2)sec=60;render.setEnabled(false);cancel.setEnabled(true);progress.setProgress(0);result.setVisibility(View.GONE);status.setText("กำลังเตรียม native encoder...");exporter=new VideoExporter(this,images,music,sec,name.getText().toString(),price.getText().toString(),tagline.getText().toString(),new VideoExporter.Listener(){public void onProgress(int p){runOnUiThread(()->{progress.setProgress(p);status.setText("กำลังสร้างวิดีโอ "+p+"% ");});}public void onDone(Uri uri){runOnUiThread(()->{render.setEnabled(true);cancel.setEnabled(false);status.setText("บันทึกใน Gallery แล้ว");result.setVideoURI(uri);result.setVisibility(View.VISIBLE);result.start();share(uri);});}public void onError(String e){runOnUiThread(()->{render.setEnabled(true);cancel.setEnabled(false);status.setText(e);});}});exporter.start();}
    private void share(Uri uri){Intent i=new Intent(Intent.ACTION_SEND);i.setType("video/mp4");i.putExtra(Intent.EXTRA_STREAM,uri);i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);startActivity(Intent.createChooser(i,"แชร์วิดีโอ ProductPromo"));}
}
