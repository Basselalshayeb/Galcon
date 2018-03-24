using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Planet_scripte : MonoBehaviour {
    public int _ammo=100;
    public string _forwhoisthisplanet="none";
    public int _scale=3;
    float _time=0;
	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {

        if(_forwhoisthisplanet=="none")
        {
            _time = Time.time;
           
        }
        //ammo <=200
        if(_forwhoisthisplanet!="none")
        {
            if(Time.time-_time>=2f)
            {
                _ammo += _scale;
                Debug.Log(_ammo);
                _time = Time.time;

            }

        }
		
	}
}
